import { History, AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const causeData = [
  { name: "Grounding", value: 35, color: "#ef4444" },
  { name: "Collision", value: 25, color: "#f59e0b" },
  { name: "Equipment Failure", value: 22, color: "#22d3ee" },
  { name: "Operational", value: 12, color: "#8b5cf6" },
  { name: "Unknown", value: 6, color: "#6b7280" },
];

const historicalSpills = [
  { year: 2019, distance: "12 km", cause: "Grounding", vessel: "MV Wakashio" },
  { year: 2021, distance: "34 km", cause: "Equipment Failure", vessel: "X-Press Pearl" },
  { year: 2023, distance: "8 km", cause: "Collision", vessel: "Unknown tanker" },
];

const HistoricalContext = () => {
  return (
    <section className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Historical Context (NLP)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk zone + timeline */}
        <div className="md:col-span-2 space-y-4">
          {/* Risk badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-md px-4 py-2">
              <ShieldAlert className="w-5 h-5 text-danger" />
              <div>
                <p className="text-sm font-bold text-danger">HIGH RISK</p>
                <p className="text-xs text-muted-foreground">Zone Classification</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[
                { label: "HIGH", active: true, color: "bg-danger" },
                { label: "MED", active: false, color: "bg-warning" },
                { label: "LOW", active: false, color: "bg-accent" },
                { label: "MIN", active: false, color: "bg-success" },
              ].map((b) => (
                <span
                  key={b.label}
                  className={`text-[10px] px-2 py-1 rounded ${
                    b.active ? `${b.color}/20 text-foreground font-semibold` : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Historical spills table */}
          <div className="bg-background/50 rounded-lg border border-border/30 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Year</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Distance</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Cause</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium hidden sm:table-cell">Vessel</th>
                </tr>
              </thead>
              <tbody>
                {historicalSpills.map((s) => (
                  <tr key={s.year} className="border-b border-border/20 last:border-0">
                    <td className="px-3 py-2 font-mono text-foreground">{s.year}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.distance}</td>
                    <td className="px-3 py-2">
                      <span className="bg-warning/10 text-warning px-1.5 py-0.5 rounded text-[10px]">{s.cause}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{s.vessel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prevention tip */}
          <div className="flex items-start gap-2 bg-accent/5 border border-accent/20 rounded-md px-3 py-2">
            <Shield className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">Prevention tip:</span> Use enhanced navigation systems in shallow coastal zones. Historical groundings in this region correlate with inadequate depth sounding data.
            </p>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Cause Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={causeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {causeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(216, 40%, 16%)",
                  border: "1px solid hsl(216, 25%, 25%)",
                  borderRadius: "6px",
                  color: "hsl(60, 6%, 88%)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {causeData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-mono text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoricalContext;
