import { FileText, Download, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IncidentReport from "./IncidentReport";

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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Summary */}
        <div className="xl:col-span-2 space-y-4">
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
        <div className="xl:col-span-3 bg-background/50 rounded-lg border border-border/30 p-4 overflow-y-auto max-h-[600px]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            AI Report Preview
          </p>
          {showPreview ? (
            <IncidentReport />
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
