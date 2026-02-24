import { useState } from "react";
import { LifeBuoy, ChevronDown, ChevronUp, Upload, Map, ShieldCheck, FileText } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload SAR Image", desc: "Start by uploading a Sentinel-1 SAR GeoTIFF file to detect oil spill candidates." },
  { icon: Map, title: "View Drift Forecast", desc: "See the particle-based dispersion simulation over the next 24 hours (map tiles require internet)." },
  { icon: ShieldCheck, title: "Review Validation", desc: "The system validates detection using physics alignment, ML classification, and historical risk context." },
  { icon: FileText, title: "Generate Report", desc: "Click \"Generate Report\" to produce an official PDF for coast guard dispatch." },
];

const NeedHelp = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <LifeBuoy className="w-4 h-4 text-accent" />
        Need Help? 🆘
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border/50">
          <h3 className="text-sm font-semibold text-foreground mt-4 mb-3">How to Use OceanGuard AI</h3>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <s.icon className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{s.title}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default NeedHelp;
