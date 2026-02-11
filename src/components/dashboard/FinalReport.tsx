import { FileText, Download, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FinalReport = () => {
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  return (
    <section className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Final Report & Export
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-lg p-4">
            <AlertTriangle className="w-6 h-6 text-danger shrink-0" />
            <div>
              <p className="text-sm font-bold text-danger">Confirmed Oil Spill</p>
              <p className="text-xs text-muted-foreground">All modules indicate high probability of petroleum-based discharge</p>
            </div>
          </div>

          <div className="bg-background/50 rounded-lg border border-border/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence Summary</p>
            {[
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "SAR segmentation detected low-backscatter region (F1: 87%, IoU: 0.58)" },
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "Physics validation passed — alignment 89°, elongation 3.42" },
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "ML classifier: Oil-like with 99.94% confidence" },
              { icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" />, text: "High-risk zone — 3 historical spills within 35 km" },
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "24h drift forecast indicates coastal approach — action required" },
            ].map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">{e.icon}</span>
                <p className="text-xs text-muted-foreground">{e.text}</p>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Generate PDF Report
              </span>
            )}
          </Button>
        </div>

        {/* Report preview */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            AI Report Preview
          </p>
          {showPreview ? (
            <div className="font-mono text-xs text-muted-foreground space-y-3 leading-relaxed">
              <p className="text-foreground font-semibold text-sm">
                OceanGuard Incident Report — {new Date().toLocaleDateString()}
              </p>
              <p>
                <span className="text-accent">CLASSIFICATION:</span> Confirmed petroleum-based oil spill detected in the Ionian Sea (38.7°N, 20.3°E) via Sentinel-1 SAR imagery processed through MarineXt deep learning architecture.
              </p>
              <p>
                <span className="text-accent">ANALYSIS:</span> The detected region exhibits characteristic low backscatter (−12.3 dB), irregular morphology (elongation 3.42, compactness 0.31), and strong alignment with prevailing surface currents (89° deviation). Random Forest classifier confirms oil-like signature with 99.94% confidence based on four spectral-geometric features.
              </p>
              <p>
                <span className="text-accent">DRIFT FORECAST:</span> CMEMS surface current data combined with ERA5 10m wind fields indicate the slick will approach the western coastline within 18–24 hours under current conditions. Immediate deployment of containment booms is recommended.
              </p>
              <p>
                <span className="text-accent">RECOMMENDATION:</span> Escalate to REMPEC and national coast guard. Initiate Tier-2 response protocol. Historical data indicates grounding as the most probable cause — verify vessel traffic in the area.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40">
              <HelpCircle className="w-8 h-8 mb-2" />
              <p className="text-xs">Click "Generate PDF Report" to preview</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalReport;
