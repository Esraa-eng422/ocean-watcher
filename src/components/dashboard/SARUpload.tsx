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
    <section className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          SAR Image Upload & Detection
        </h2>
      </div>

      {status === "idle" && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors ${
            dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-1">Drop Sentinel-1 GeoTIFF here</p>
          <p className="text-xs text-muted-foreground/60">or click to browse</p>
          <input type="file" className="hidden" accept=".tif,.tiff" onChange={handleFileChange} />
        </label>
      )}

      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-sm text-muted-foreground">Processing {file?.name}...</p>
          <p className="text-xs text-muted-foreground/60">Running MarineXt segmentation model</p>
        </div>
      )}

      {(status === "detected" || status === "clear") && (
        <div className="space-y-4">
          {/* Side by side images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg bg-background/50 border border-border/50 p-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" /> Original SAR Image
              </p>
              <div className="aspect-video bg-ocean-deep rounded overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-30" style={{
                  background: "repeating-conic-gradient(hsl(210 22% 37% / 0.3) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px"
                }} />
                <span className="text-xs text-muted-foreground/50 z-10">SAR Backscatter</span>
              </div>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/50 p-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5" /> MarineXt Segmentation Mask
              </p>
              <div className="aspect-video bg-ocean-deep rounded overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-4 rounded-full bg-danger/20 border-2 border-danger/40" style={{
                  borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
                }} />
                <span className="text-xs text-danger/70 z-10 font-mono">SPILL REGION</span>
              </div>
            </div>
          </div>

          {/* Status + metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-md px-3 py-1.5">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-sm font-medium text-danger">Candidate Detected</span>
            </div>
            <MetricBadge label="F1-Score" value="87%" />
            <MetricBadge label="IoU" value="0.58" />
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
  <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-3 py-1.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-mono font-semibold text-accent">{value}</span>
  </div>
);

export default SARUpload;
