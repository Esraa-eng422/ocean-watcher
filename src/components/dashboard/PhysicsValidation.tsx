import { ShieldCheck, ShieldX, Compass, Maximize2, Activity, Circle } from "lucide-react";

const metrics = [
  { label: "Drift alignment", value: "89°", detail: "Spill shape matches ocean current direction", icon: <Compass className="w-4 h-4" />, pass: true },
  { label: "Shape: Stretched", value: "3.42", detail: "Elongated pattern consistent with wind spreading", icon: <Maximize2 className="w-4 h-4" />, pass: true },
  { label: "Radar darkness", value: "-12.3 dB", detail: "Low signal return — typical of oil on water", icon: <Activity className="w-4 h-4" />, pass: true },
  { label: "Irregular outline", value: "0.31", detail: "Non-geometric shape — matches natural spill", icon: <Circle className="w-4 h-4" />, pass: true },
];

const PhysicsValidation = () => {
  const allPass = metrics.every((m) => m.pass);

  return (
    <section className="glass-card p-6 animate-slide-up border-2 border-accent/20" style={{ animationDelay: "0.1s" }} aria-label="Physics validation results">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Physical Plausibility Check
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Primary Validation</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${
            allPass
              ? "bg-success/15 text-success border border-success/30"
              : "bg-danger/15 text-danger border border-danger/30"
          }`}
          role="status"
          aria-live="polite"
        >
          {allPass ? <ShieldCheck className="w-4 h-4" aria-hidden="true" /> : <ShieldX className="w-4 h-4" aria-hidden="true" />}
          {allPass ? "✓ Physically Plausible" : "✗ Not Plausible"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-3 bg-background/50 rounded-lg border border-border/30 px-4 py-3.5"
          >
            <div className="text-accent/70 shrink-0" aria-hidden="true">{m.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{m.detail}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-mono font-semibold text-accent">{m.value}</span>
              {m.pass ? (
                <ShieldCheck className="w-4 h-4 text-success" aria-label="Passed" />
              ) : (
                <ShieldX className="w-4 h-4 text-danger" aria-label="Failed" />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-4 italic">
        Based on Sentinel-1 SAR geometry, CMEMS surface currents, and ERA5 wind fields.
      </p>
    </section>
  );
};

export default PhysicsValidation;
