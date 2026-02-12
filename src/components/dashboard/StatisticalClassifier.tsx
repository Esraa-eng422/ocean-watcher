import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const featureData = [
  { name: "Shape stretch", value: 33.2 },
  { name: "Radar darkness", value: 28.6 },
  { name: "Outline regularity", value: 22.1 },
  { name: "Signal variation", value: 16.1 },
];

const barColors = [
  "hsl(186, 80%, 42%)",
  "hsl(186, 70%, 36%)",
  "hsl(186, 60%, 30%)",
  "hsl(186, 50%, 26%)",
];

const StatisticalClassifier = () => {
  return (
    <section className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.15s" }} aria-label="Statistical classification results">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-accent" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Statistical Consistency Check
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Supporting Evidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prediction card */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Result</span>
            <span className="text-xs font-mono bg-danger/10 text-danger px-2.5 py-1 rounded-md font-semibold">Oil-like</span>
          </div>
          <div className="text-center py-5" role="status" aria-live="polite">
            <p className="text-4xl font-mono font-bold text-accent" aria-label="Confidence: 99.94 percent">99.94%</p>
            <p className="text-xs text-muted-foreground mt-2">Confidence Score</p>
          </div>
        </div>

        {/* Feature importance */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Key Factors</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={featureData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 40]} />
              <YAxis
                type="category"
                dataKey="name"
                width={105}
                tick={{ fill: "hsl(210, 10%, 60%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(216, 40%, 16%)",
                  border: "1px solid hsl(216, 25%, 25%)",
                  borderRadius: "6px",
                  color: "hsl(60, 6%, 88%)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, "Importance"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                {featureData.map((_, i) => (
                  <Cell key={i} fill={barColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-4 italic">
        Feature-based classifier — supports primary physics validation.
      </p>
    </section>
  );
};

export default StatisticalClassifier;
