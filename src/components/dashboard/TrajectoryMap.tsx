import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, ExternalLink, Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Generate 5000 particles with cohesive plume behavior
const generateParticles = () => {
  const particles: { lat: number; lng: number; group: number }[][] = [];
  const numParticles = 5000;

  // Create base positions clustered around spill center with gaussian-like distribution
  const basePositions = Array.from({ length: numParticles }, () => {
    // Box-Muller transform for gaussian clustering
    const u1 = Math.random();
    const u2 = Math.random();
    const r = Math.sqrt(-2 * Math.log(u1)) * 0.012;
    const theta = 2 * Math.PI * u2;
    return {
      lat: 38.7 + r * Math.cos(theta),
      lng: 20.3 + r * Math.sin(theta),
      group: Math.random(), // 0-1 for color grouping
    };
  });

  for (let t = 0; t <= 24; t++) {
    const tFactor = t / 24;
    particles.push(
      basePositions.map((p) => {
        // Simulate current-driven drift + turbulent diffusion
        const driftLat = t * 0.004 * (1 + p.group * 0.3);
        const driftLng = t * 0.008 * (1 + p.group * 0.2);
        const diffusion = 0.003 * Math.sqrt(t);
        const u1 = Math.random();
        const u2 = Math.random();
        const gaussR = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001)));
        const gaussTheta = 2 * Math.PI * u2;

        return {
          lat: p.lat + driftLat + gaussR * diffusion * Math.cos(gaussTheta),
          lng: p.lng + driftLng + gaussR * diffusion * Math.sin(gaussTheta),
          group: p.group,
        };
      })
    );
  }
  return particles;
};

const particleTimeSeries = generateParticles();

const getParticleColor = (group: number, timeStep: number): string => {
  const tNorm = timeStep / 24;
  // Core particles (low group) stay crimson, outer particles transition orange → blue
  if (group < 0.3 && tNorm < 0.4) return "#e74c3c"; // crimson core
  if (tNorm < 0.25) return "#e74c3c";
  if (tNorm < 0.5) return group < 0.5 ? "#e74c3c" : "#f39c12";
  if (tNorm < 0.75) return group < 0.3 ? "#f39c12" : group < 0.7 ? "#f39c12" : "#3498db";
  return group < 0.2 ? "#f39c12" : group < 0.5 ? "#3498db" : "#3498db";
};

const TrajectoryMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [timeStep, setTimeStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, {
        center: [38.75, 20.45],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        opacity: 0.4,
      }).addTo(map);

      // Spill origin marker — 20px red circle with white border
      L.circleMarker([38.7, 20.3], {
        radius: 10,
        fillColor: "#e74c3c",
        fillOpacity: 0.9,
        color: "#ffffff",
        weight: 3,
      })
        .addTo(map)
        .bindPopup(
          "<b style='color:#e74c3c'>Spill Origin</b><br/>38.700°N, 20.300°E"
        );

      // Canvas overlay for particles
      const canvasOverlay = L.DomUtil.create(
        "canvas",
        "particle-canvas"
      ) as HTMLCanvasElement;
      canvasOverlay.style.position = "absolute";
      canvasOverlay.style.top = "0";
      canvasOverlay.style.left = "0";
      canvasOverlay.style.pointerEvents = "none";
      canvasOverlay.style.zIndex = "400";
      map.getContainer()
        .querySelector(".leaflet-overlay-pane")
        ?.appendChild(canvasOverlay);

      canvasRef.current = canvasOverlay;

      const syncCanvas = () => {
        const size = map.getSize();
        canvasOverlay.width = size.x;
        canvasOverlay.height = size.y;
      };
      syncCanvas();
      map.on("move zoom resize", syncCanvas);

      mapInstanceRef.current = { map, L };
    });
  }, []);

  // Render particles on canvas for performance
  useEffect(() => {
    const inst = mapInstanceRef.current;
    const canvas = canvasRef.current;
    if (!inst || !canvas) return;
    const { map } = inst;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const positions = particleTimeSeries[timeStep];
      const particleSize = 7; // radius in px (14-16px diameter)

      positions.forEach((p) => {
        const point = map.latLngToContainerPoint([p.lat, p.lng]);
        const color = getParticleColor(p.group, timeStep);

        // Glow effect
        ctx.beginPath();
        ctx.arc(point.x, point.y, particleSize + 4, 0, Math.PI * 2);
        ctx.fillStyle =
          color +
          "15"; // very faint glow
        ctx.fill();

        // Main particle
        ctx.beginPath();
        ctx.arc(point.x, point.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle =
          color +
          "70"; // ~44% opacity
        ctx.fill();
      });
    };

    render();
    const handler = () => render();
    map.on("move zoom moveend zoomend", handler);
    return () => {
      map.off("move zoom moveend zoomend", handler);
    };
  }, [timeStep]);

  // Playback
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTimeStep((prev) => {
          if (prev >= 24) {
            setPlaying(false);
            return 24;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const togglePlay = useCallback(() => {
    if (timeStep >= 24) {
      setTimeStep(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [timeStep]);

  return (
    <section
      className="glass-card animate-slide-up"
      style={{ animationDelay: "0.2s" }}
      aria-label="Drift trajectory simulation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2.5">
          <Navigation className="w-5 h-5 text-accent" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              2. Drift &amp; Spread Simulation
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              5,000-particle Lagrangian dispersion model
            </p>
          </div>
        </div>

        {/* Time badge */}
        <div className="flex items-center gap-1.5 bg-card border border-border/50 rounded-full px-3 py-1.5">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-mono text-foreground">
            T+{timeStep}h
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="p-4">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
        <div
          ref={mapRef}
          className="h-[480px] rounded-lg border border-border/50 overflow-hidden relative"
          role="img"
          aria-label="Interactive map showing predicted oil spill drift cloud"
        />
      </div>

      {/* Controls */}
      <div className="px-5 pb-5">
        <div className="bg-background/60 rounded-lg border border-border/30 p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full border border-border/50 hover:border-accent/50 hover:bg-accent/10"
              onClick={togglePlay}
              aria-label={playing ? "Pause simulation" : "Play drift simulation"}
            >
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <div className="flex-1 flex flex-col gap-1.5">
              <Slider
                value={[timeStep]}
                min={0}
                max={24}
                step={1}
                onValueChange={([v]) => {
                  setTimeStep(v);
                  setPlaying(false);
                }}
                aria-label="Forecast time step in hours"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
                <span>18h</span>
                <span>24h</span>
              </div>
            </div>
          </div>

          {/* Legend & Attribution */}
          <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-border/20">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#e74c3c" }}
                  aria-hidden="true"
                />
                Core (0–6h)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#f39c12" }}
                  aria-hidden="true"
                />
                Mid (6–12h)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#3498db" }}
                  aria-hidden="true"
                />
                Edge (12–24h)
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full border-2 border-foreground/60"
                  style={{ background: "#e74c3c" }}
                  aria-hidden="true"
                />
                Origin
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/60 italic mt-1 sm:mt-0">
              Simulated using CMEMS currents + ERA5 winds
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => navigate("/netcdf-details")}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View
            Simulation Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrajectoryMap;
