import { useState, useCallback } from "react";
import { Upload, Radar, CheckCircle, AlertTriangle, Loader2, Image, ScanLine } from "lucide-react";

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
    <section className="glass-card p-6 animate-slide-up" aria-label="Oil Candidate Detection">
      {/* Step header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent font-mono font-bold text-sm">
          1
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Detect Oil Candidate from Satellite
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload a Sentinel-1 SAR GeoTIFF to run spill segmentation
          </p>
        </div>
      </div>

      {/* Upload area — visible only when idle */}
      {status === "idle" && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-14 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${
            dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-9 h-9 text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-sm text-foreground font-medium mb-1">Upload Sentinel-1 GeoTIFF</p>
          <p className="text-xs text-muted-foreground">Drop .tif file here or click to browse</p>
          <input
            type="file"
            className="hidden"
            accept=".tif,.tiff"
            onChange={handleFileChange}
            aria-label="Upload Sentinel-1 GeoTIFF file"
          />
        </label>
      )}

      {/* Processing state */}
      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center py-16 gap-3" role="status" aria-live="polite">
          <Loader2 className="w-9 h-9 text-accent animate-spin" />
          <p className="text-sm text-foreground font-medium">Running segmentation model…</p>
          <p className="text-xs text-muted-foreground">{file?.name}</p>
        </div>
      )}

      {/* Results */}
      {(status === "detected" || status === "clear") && (
        <div className="space-y-5">
          {/* Side-by-side viewer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original SAR */}
            <div className="rounded-lg bg-background/40 border border-border/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-border/30 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs text-muted-foreground font-medium">Original SAR</span>
              </div>
              <div className="aspect-[4/3] bg-ocean-deep relative">
                {/* Simulated SAR backscatter texture */}
                <div className="absolute inset-0" style={{
                  background: `
                    repeating-conic-gradient(hsl(var(--ocean-surface) / 0.15) 0% 25%, transparent 0% 50%) 0 0 / 12px 12px,
                    linear-gradient(180deg, hsl(var(--ocean-mid)) 0%, hsl(var(--ocean-deep)) 100%)
                  `,
                }} />
                {/* Noise overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                  background: "repeating-conic-gradient(hsl(var(--ocean-foam) / 0.08) 0% 25%, transparent 0% 50%) 0 0 / 6px 6px",
                }} />
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/40">
                  Sentinel-1 IW GRD
                </div>
              </div>
            </div>

            {/* Right: SAR + Mask overlay */}
            <div className="rounded-lg bg-background/40 border border-border/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-border/30 flex items-center gap-1.5">
                <ScanLine className="w-3.5 h-3.5 text-danger" aria-hidden="true" />
                <span className="text-xs text-muted-foreground font-medium">Segmentation Mask Overlay</span>
              </div>
              <div className="aspect-[4/3] bg-ocean-deep relative">
                {/* Same SAR texture */}
                <div className="absolute inset-0" style={{
                  background: `
                    repeating-conic-gradient(hsl(var(--ocean-surface) / 0.15) 0% 25%, transparent 0% 50%) 0 0 / 12px 12px,
                    linear-gradient(180deg, hsl(var(--ocean-mid)) 0%, hsl(var(--ocean-deep)) 100%)
                  `,
                }} />
                <div className="absolute inset-0 opacity-20" style={{
                  background: "repeating-conic-gradient(hsl(var(--ocean-foam) / 0.08) 0% 25%, transparent 0% 50%) 0 0 / 6px 6px",
                }} />
                {/* Red mask polygon — semi-transparent at 50% */}
                {status === "detected" && (
                  <div
                    className="absolute"
                    style={{
                      top: "18%", left: "20%", width: "55%", height: "58%",
                      background: "hsl(var(--danger) / 0.5)",
                      border: "2px solid hsl(var(--danger) / 0.7)",
                      borderRadius: "38% 62% 50% 50% / 48% 40% 60% 52%",
                    }}
                  />
                )}
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-danger/60">
                  {status === "detected" ? "MASK DETECTED" : "NO MASK"}
                </div>
              </div>
            </div>
          </div>

          {/* Status + Metrics row */}
          <div className="flex flex-wrap items-center gap-3">
            {status === "detected" ? (
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg px-4 py-2.5">
                <AlertTriangle className="w-5 h-5 text-danger" aria-hidden="true" />
                <span className="text-sm font-semibold text-danger">Candidate Detected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-lg px-4 py-2.5">
                <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
                <span className="text-sm font-semibold text-success">No Spill Found</span>
              </div>
            )}

            {status === "detected" && (
              <>
                <MetricChip label="F1-score" value="87%" />
                <MetricChip label="IoU" value="0.58" />
              </>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => { setStatus("idle"); setFile(null); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Upload another image
          </button>
        </div>
      )}
    </section>
  );
};

const MetricChip = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-1.5 bg-muted/40 border border-border/30 rounded-lg px-3 py-2">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-mono font-semibold text-accent">{value}</span>
  </div>
);

export default SARUpload;
