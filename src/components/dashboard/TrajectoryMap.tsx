import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Wind, Navigation, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrajectoryMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    import("leaflet").then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [38.5, 20.5],
        zoom: 7,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© CartoDB",
      }).addTo(map);

      // Spill centroid
      const centroid = L.circleMarker([38.7, 20.3], {
        radius: 10,
        fillColor: "#ef4444",
        fillOpacity: 0.7,
        color: "#ef4444",
        weight: 2,
      }).addTo(map);
      centroid.bindPopup("<b>Spill Centroid</b><br/>38.7°N, 20.3°E");

      // Drift forecast path
      const driftPoints: [number, number][] = [
        [38.7, 20.3], [38.72, 20.35], [38.75, 20.42],
        [38.78, 20.48], [38.82, 20.55], [38.85, 20.6],
      ];
      L.polyline(driftPoints, {
        color: "#f59e0b",
        weight: 3,
        dashArray: "8, 6",
        opacity: 0.8,
      }).addTo(map);

      // Wind arrows (simplified as small polylines)
      const windOrigins: [number, number][] = [
        [38.6, 20.1], [38.8, 20.5], [38.9, 20.7],
      ];
      windOrigins.forEach(([lat, lng]) => {
        L.polyline([[lat, lng], [lat + 0.05, lng + 0.08]], {
          color: "#22d3ee",
          weight: 2,
          opacity: 0.6,
        }).addTo(map);
        L.circleMarker([lat + 0.05, lng + 0.08], {
          radius: 3,
          fillColor: "#22d3ee",
          fillOpacity: 0.8,
          color: "#22d3ee",
          weight: 1,
        }).addTo(map);
      });

      // Drift endpoint
      L.circleMarker([38.85, 20.6], {
        radius: 6,
        fillColor: "#f59e0b",
        fillOpacity: 0.6,
        color: "#f59e0b",
        weight: 2,
      }).addTo(map).bindPopup("<b>24h Forecast</b><br/>Drift endpoint");

      setMapLoaded(true);
    });
  }, [mapLoaded]);

  const validations = [
    { label: "Alignment Angle", value: "89°", detail: "within tolerance", pass: true },
    { label: "Elongation", value: "3.42", detail: "typical oil signature", pass: true },
    { label: "Mean Intensity", value: "-12.3 dB", detail: "low backscatter", pass: true },
    { label: "Compactness", value: "0.31", detail: "irregular shape", pass: true },
    { label: "Wind Speed", value: "4.2 m/s", detail: "> 3 m/s threshold", pass: true },
  ];

  return (
    <section className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Trajectory Simulation
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
          <div ref={mapRef} className="h-[320px] rounded-lg border border-border/50 overflow-hidden" />
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger" /> Spill Centroid</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-warning" /> 24h Drift</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Wind/Current</span>
          </div>
        </div>

        {/* Validation panel */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Physics Validation
          </p>
          {validations.map((v) => (
            <div key={v.label} className="flex items-center justify-between bg-background/50 rounded-md px-3 py-2 border border-border/30">
              <div>
                <p className="text-xs font-medium text-foreground">{v.label}</p>
                <p className="text-xs text-muted-foreground">{v.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent">{v.value}</span>
                {v.pass ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-danger" />
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-xs gap-1.5"
            onClick={() => navigate("/netcdf-details")}
          >
            <ExternalLink className="w-3.5 h-3.5" /> View NetCDF Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrajectoryMap;
