import { useState, useCallback } from "react";
import { Upload, Camera, Puzzle, AlertTriangle, CheckCircle, Loader2, MapPin } from "lucide-react";

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
    setTimeout(() => setStatus("detected"), 2200);
  };

  return (
    <section className="glass-card p-6 animate-slide-up" aria-label="SAR Detection">
      {/* Step header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent font-mono font-bold text-sm">
            1
          </div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            SAR Detection
          </h2>
        </div>
        {status !== "idle" && (
          <button
            onClick={() => { setStatus("idle"); setFile(null); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Upload area */}
      {status === "idle" && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-16 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${
            dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-sm text-foreground font-medium mb-1">Upload Sentinel-1 GeoTIFF</p>
          <p className="text-xs text-muted-foreground">Drop .tif file here or click to browse</p>
          <input type="file" className="hidden" accept=".tif,.tiff" onChange={handleFileChange} aria-label="Upload Sentinel-1 GeoTIFF file" />
        </label>
      )}

      {/* Processing */}
      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center py-20 gap-3" role="status" aria-live="polite">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-sm text-foreground font-medium">Running segmentation model…</p>
          <p className="text-xs text-muted-foreground">{file?.name}</p>
        </div>
      )}

      {/* Results */}
      {(status === "detected" || status === "clear") && (
        <div className="space-y-4">
          {/* Side-by-side panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original SAR */}
            <div className="rounded-lg overflow-hidden border border-border/50">
              <div className="px-4 py-2.5 bg-card/60 border-b border-border/40 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-[hsl(207,44%,55%)]" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Original SAR Image</span>
              </div>
              <div className="aspect-square relative" style={{ background: "repeating-conic-gradient(hsl(var(--ocean-mid)) 0% 25%, hsl(var(--background)) 0% 50%) 0 0 / 8px 8px" }}>
                {/* Simulated grayscale SAR */}
                <div className="absolute inset-0" style={{
                  background: `
                    radial-gradient(ellipse at 42% 45%, hsl(0 0% 18%) 0%, transparent 60%),
                    radial-gradient(ellipse at 60% 55%, hsl(0 0% 22%) 0%, transparent 50%),
                    linear-gradient(170deg, hsl(0 0% 28%) 0%, hsl(0 0% 12%) 50%, hsl(0 0% 20%) 100%)
                  `,
                }} />
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-30" style={{
                  background: "repeating-conic-gradient(hsl(0 0% 40% / 0.12) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px",
                }} />
                {/* Metadata tag */}
                <div className="absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-[10px] font-mono text-[hsl(207,44%,55%)]">
                    Sentinel-1 IW GRD · 256×256 px
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Mask Overlay */}
            <div className="rounded-lg overflow-hidden border border-border/50">
              <div className="px-4 py-2.5 bg-card/60 border-b border-border/40 flex items-center gap-2">
                <Puzzle className="w-3.5 h-3.5 text-[hsl(207,44%,55%)]" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Segmentation Mask Overlay</span>
              </div>
              <div className="aspect-square relative" style={{ background: "repeating-conic-gradient(hsl(var(--ocean-mid)) 0% 25%, hsl(var(--background)) 0% 50%) 0 0 / 8px 8px" }}>
                {/* Same SAR base */}
                <div className="absolute inset-0" style={{
                  background: `
                    radial-gradient(ellipse at 42% 45%, hsl(0 0% 18%) 0%, transparent 60%),
                    radial-gradient(ellipse at 60% 55%, hsl(0 0% 22%) 0%, transparent 50%),
                    linear-gradient(170deg, hsl(0 0% 28%) 0%, hsl(0 0% 12%) 50%, hsl(0 0% 20%) 100%)
                  `,
                }} />
                <div className="absolute inset-0 opacity-30" style={{
                  background: "repeating-conic-gradient(hsl(0 0% 40% / 0.12) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px",
                }} />

                {/* Crimson mask overlay */}
                {status === "detected" && (
                  <div
                    className="absolute"
                    style={{
                      top: "22%", left: "24%", width: "48%", height: "50%",
                      background: "hsla(6, 78%, 57%, 0.45)",
                      border: "1px solid hsla(0, 0%, 100%, 0.7)",
                      borderRadius: "42% 58% 45% 55% / 50% 42% 58% 50%",
                      filter: "blur(1px)",
                    }}
                  />
                )}

                {/* Bottom badge */}
                <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-[10px] font-mono font-semibold" style={{ color: status === "detected" ? "hsl(6, 78%, 57%)" : "hsl(var(--success))" }}>
                    {status === "detected" ? "MASK DETECTED" : "NO MASK"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card/40 border border-border/30 rounded-lg px-4 py-3">
            {/* Left: status badge */}
            <div>
              {status === "detected" ? (
                <div className="inline-flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-full px-4 py-1.5">
                  <AlertTriangle className="w-4 h-4 text-danger" aria-hidden="true" />
                  <span className="text-sm font-semibold text-danger">Candidate Detected</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 rounded-full px-4 py-1.5">
                  <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
                  <span className="text-sm font-semibold text-success">No Spill Found</span>
                </div>
              )}
            </div>

            {/* Center: metrics */}
            {status === "detected" && (
              <div className="flex items-center gap-3">
                <MetricChip label="F1-score" value="87%" />
                <MetricChip label="IoU" value="0.58" />
              </div>
            )}

            {/* Right: centroid */}
            {status === "detected" && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-xs font-mono">29.123°N, 90.568°W</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const MetricChip = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-1.5 bg-muted/40 border border-border/30 rounded-lg px-3 py-1.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-mono font-semibold text-accent">{value}</span>
  </div>
);

export default SARUpload;
