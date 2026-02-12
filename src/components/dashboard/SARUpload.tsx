import { useState, useCallback } from "react";
import { Upload, Radar, CheckCircle, AlertTriangle, Loader2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const SARUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "detected" | "clear">("idle");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) simulateUpload(dropped);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) simulateUpload(selected);
  };

  const simulateUpload = (f: File) => {
    setFile(f);
    setStatus("uploading");
    setTimeout(() => setStatus("detected"), 2000);
  };

  return (
    <section className="glass-card p-6 animate-slide-up" aria-label="SAR Image Upload">
      <div className="flex items-center gap-2 mb-5">
        <Radar className="w-5 h-5 text-accent" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Satellite Image Upload
        </h2>
      </div>

      {status === "idle" && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${
            dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-sm text-foreground mb-1">Drop Sentinel-1 GeoTIFF here</p>
          <p className="text-xs text-muted-foreground">or click to browse your files</p>
          <input type="file" className="hidden" accept=".tif,.tiff" onChange={handleFileChange} aria-label="Upload satellite image file" />
        </label>
      )}

      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-live="polite">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-sm text-foreground">Analyzing {file?.name}…</p>
          <p className="text-xs text-muted-foreground">Running spill detection model</p>
        </div>
      )}

      {(status === "detected" || status === "clear") && (
        <div className="space-y-5">
          {/* Side by side images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-background/50 border border-border/50 p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" aria-hidden="true" /> Original Satellite Image
              </p>
              <div className="aspect-video bg-ocean-deep rounded overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-30" style={{
                  background: "repeating-conic-gradient(hsl(210 22% 37% / 0.3) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px"
                }} />
                <span className="text-xs text-muted-foreground/50 z-10">SAR Backscatter</span>
              </div>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/50 p-4">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5" aria-hidden="true" /> Detection Overlay
              </p>
              <div className="aspect-video bg-ocean-deep rounded overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-4 bg-danger/20 border-2 border-danger/40" style={{
                  borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
                }} />
                <span className="text-xs text-danger/70 z-10 font-mono">SPILL REGION</span>
              </div>
            </div>
          </div>

          {/* Status badge — large, clear */}
          <div className="flex flex-wrap items-center gap-3" role="status" aria-live="polite">
            <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg px-4 py-2.5">
              <AlertTriangle className="w-5 h-5 text-danger" aria-hidden="true" />
              <span className="text-sm font-semibold text-danger">⚠ Candidate Detected</span>
            </div>
            <MetricBadge label="Detection quality" value="87%" />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => { setStatus("idle"); setFile(null); }}
          >
            Upload New Image
          </Button>
        </div>
      )}
    </section>
  );
};

const MetricBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-2">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-mono font-semibold text-accent">{value}</span>
  </div>
);

export default SARUpload;
