import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation, ExternalLink, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Generate particle positions for 25 time steps (0–24h)
const generateParticles = () => {
  const particles: { lat: number; lng: number }[][] = [];
  const basePositions = Array.from({ length: 40 }, (_, i) => ({
    lat: 38.7 + (Math.random() - 0.5) * 0.06,
    lng: 20.3 + (Math.random() - 0.5) * 0.06,
  }));

  for (let t = 0; t <= 24; t++) {
    particles.push(
      basePositions.map((p) => ({
        lat: p.lat + t * 0.006 + (Math.random() - 0.5) * 0.008 * t * 0.3,
        lng: p.lng + t * 0.012 + (Math.random() - 0.5) * 0.01 * t * 0.3,
      }))
    );
  }
  return particles;
};

const particleTimeSeries = generateParticles();

const spillPolygon: [number, number][] = [
  [38.73, 20.27], [38.72, 20.31], [38.68, 20.33],
  [38.67, 20.29], [38.69, 20.26], [38.73, 20.27],
];

const TrajectoryMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [timeStep, setTimeStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { center: [38.75, 20.45], zoom: 8, zoomControl: false });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© CartoDB",
      }).addTo(map);

      L.polygon(spillPolygon, {
        color: "hsl(4, 78%, 62%)",
        weight: 2,
        fillColor: "hsl(4, 78%, 62%)",
        fillOpacity: 0.15,
        dashArray: "4, 4",
      }).addTo(map).bindPopup("<b>Initial Spill Footprint</b><br/>Detected region from satellite");

      L.circleMarker([38.7, 20.3], {
        radius: 8,
        fillColor: "hsl(4, 78%, 62%)",
        fillOpacity: 0.8,
        color: "#ffffff",
        weight: 2,
      }).addTo(map).bindPopup("<b>Spill Centre</b><br/>38.7°N, 20.3°E");

      mapInstanceRef.current = { map, L };
    });
  }, []);

  useEffect(() => {
    const inst = mapInstanceRef.current;
    if (!inst) return;
    const { map, L } = inst;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const positions = particleTimeSeries[timeStep];
    positions.forEach((p) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 3,
        fillColor: "hsl(38, 92%, 50%)",
        fillOpacity: 0.7,
        color: "hsl(38, 92%, 50%)",
        weight: 0,
      }).addTo(map);
      markersRef.current.push(marker);
    });
  }, [timeStep]);

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
      }, 400);
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
    <section className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.2s" }} aria-label="Drift trajectory visualization">
      <div className="flex items-center gap-2 mb-5">
        <Navigation className="w-5 h-5 text-accent" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Drift Forecast
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            24-hour prediction based on ocean currents and wind data
          </p>
        </div>
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} className="h-[360px] rounded-lg border border-border/50 overflow-hidden" role="img" aria-label="Interactive map showing predicted oil spill drift" />

      {/* Controls */}
      <div className="mt-4 bg-background/50 rounded-lg border border-border/30 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={togglePlay}
            aria-label={playing ? "Pause animation" : "Play drift animation"}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <div className="flex-1">
            <Slider
              value={[timeStep]}
              min={0}
              max={24}
              step={1}
              onValueChange={([v]) => { setTimeStep(v); setPlaying(false); }}
              aria-label="Forecast time step in hours"
            />
          </div>

          <span className="text-xs font-mono text-accent shrink-0 w-14 text-right" aria-live="polite">
            T+{timeStep}h
          </span>
        </div>

        <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" aria-hidden="true" />
            Spill centre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" aria-hidden="true" />
            Predicted positions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border border-danger/50 border-dashed" aria-hidden="true" />
            Initial footprint
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate("/netcdf-details")}>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View Simulation Details
        </Button>
      </div>
    </section>
  );
};

export default TrajectoryMap;
