import { useState } from "react";
import { FileText, Download, CheckCircle, AlertTriangle, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import IncidentReport from "./IncidentReport";

const DecisionSummary = () => {
  const [generating, setGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // In production, these would come from the pipeline
  const physicsPlausible = true;
  const status = physicsPlausible ? "confirmed" : "suspected";

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  return (
    <section className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0.45s" }}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Decision Summary & Report
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 space-y-4">
          {/* Status */}
          {status === "confirmed" ? (
            <div className="flex items-center gap-3 bg-danger/10 border border-danger/30 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-danger shrink-0" />
              <div>
                <p className="text-sm font-bold text-danger">Confirmed Oil Spill</p>
                <p className="text-xs text-muted-foreground">Physical plausibility check passed — high-confidence detection</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-warning/10 border border-warning/30 rounded-lg p-4">
              <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
              <div>
                <p className="text-sm font-bold text-warning">Suspected Look-alike</p>
                <p className="text-xs text-muted-foreground">Physical plausibility check failed — may be biogenic slick or sensor artifact</p>
              </div>
            </div>
          )}

          {/* Explanation hierarchy */}
          <div className="bg-background/50 rounded-lg border border-border/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Decision Rationale</p>
            
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 bg-accent/20 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded">PRIMARY</span>
              <p className="text-xs text-foreground">
                Physical plausibility — drift alignment, elongation, and intensity consistent with petroleum discharge
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 bg-muted text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">SUPPORT</span>
              <p className="text-xs text-muted-foreground">
                Statistical consistency — 99.94% confidence in oil-like classification
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 bg-muted text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">CONTEXT</span>
              <p className="text-xs text-muted-foreground">
                Historical data — high-risk zone with 12 past incidents within 50 km
              </p>
            </div>
          </div>

          {/* Evidence bullets */}
          <div className="bg-background/50 rounded-lg border border-border/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence</p>
            {[
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "SAR segmentation detected low-backscatter region (MarineXt)" },
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "Drift alignment 89° — within 90° physical tolerance" },
              { icon: <CheckCircle className="w-3.5 h-3.5 text-success" />, text: "Statistical classifier: Oil-like (99.94% confidence)" },
              { icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" />, text: "High-risk zone — 12 past spills within 50 km" },
              { icon: <Info className="w-3.5 h-3.5 text-accent" />, text: "24h drift forecast shows coastal approach — action required" },
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
                Generate Official Report
              </span>
            )}
          </Button>
        </div>

        {/* Report preview */}
        <div className="xl:col-span-3 bg-background/50 rounded-lg border border-border/30 p-4 overflow-y-auto max-h-[600px]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Report Preview
          </p>
          {showReport ? (
            <IncidentReport />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/40">
              <HelpCircle className="w-8 h-8 mb-2" />
              <p className="text-xs">Click "Generate Official Report" to preview</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DecisionSummary;
