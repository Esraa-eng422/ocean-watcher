import { ShieldCheck, ShieldX, Compass, Maximize2, Activity, Circle } from "lucide-react";

const metrics = [
  { label: "Alignment Angle", value: "89°", detail: "Slick vs. drift direction (tolerance: 90°)", icon: <Compass className="w-4 h-4" />, pass: true },
  { label: "Elongation Ratio", value: "3.42", detail: "Consistent with wind-driven spreading", icon: <Maximize2 className="w-4 h-4" />, pass: true },
  { label: "Mean Intensity", value: "-12.3 dB", detail: "Low backscatter — typical oil signature", icon: <Activity className="w-4 h-4" />, pass: true },
  { label: "Compactness", value: "0.31", detail: "Irregular shape — natural spill pattern", icon: <Circle className="w-4 h-4" />, pass: true },
];

const PhysicsValidation = () => {
  const allPass = metrics.every((m) => m.pass);

  return (
    <section className="glass-card p-5 animate-slide-up border-2 border-accent/20" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Physical Plausibility Check
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Primary Validation · Classifier 1</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${
            allPass
              ? "bg-success/15 text-success border border-success/30"
              : "bg-danger/15 text-danger border border-danger/30"
          }`}
        >
          {allPass ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldX className="w-3.5 h-3.5" />}
          {allPass ? "Physically Plausible" : "Not Plausible"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-3 bg-background/50 rounded-lg border border-border/30 px-4 py-3"
          >
            <div className="text-accent/70 shrink-0">{m.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground truncate">{m.detail}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-mono font-semibold text-accent">{m.value}</span>
              {m.pass ? (
                <ShieldCheck className="w-4 h-4 text-success" />
              ) : (
                <ShieldX className="w-4 h-4 text-danger" />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-3 italic">
        Based on real ocean physics — Sentinel-1 SAR geometry, CMEMS surface currents, and ERA5 wind fields.
      </p>
    </section>
  );
};

export default PhysicsValidation;
