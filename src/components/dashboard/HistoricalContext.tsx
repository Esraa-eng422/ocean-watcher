import { useNavigate } from "react-router-dom";
import { History, Shield, ShieldAlert, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const causeData = [
  { name: "Grounding", value: 35, color: "hsl(4, 78%, 62%)" },
  { name: "Collision", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Equipment Failure", value: 22, color: "hsl(186, 80%, 42%)" },
  { name: "Operational", value: 12, color: "hsl(260, 48%, 65%)" },
  { name: "Unknown", value: 6, color: "hsl(210, 10%, 45%)" },
];

const historicalSpills = [
  { year: 2019, distance: "12 km", cause: "Grounding", vessel: "MV Wakashio" },
  { year: 2021, distance: "34 km", cause: "Equipment Failure", vessel: "X-Press Pearl" },
  { year: 2023, distance: "8 km", cause: "Collision", vessel: "Unknown tanker" },
];

const HistoricalContext = () => {
  const navigate = useNavigate();
  return (
    <section className="glass-card p-6 animate-slide-up" style={{ animationDelay: "0.25s" }} aria-label="Historical incident context">
      <div className="flex items-center gap-2 mb-5">
        <History className="w-5 h-5 text-accent" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Historical Context
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Risk badge — large, clear */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-danger/10 border border-danger/30 rounded-lg px-5 py-3" role="status">
              <ShieldAlert className="w-6 h-6 text-danger" aria-hidden="true" />
              <div>
                <p className="text-base font-bold text-danger">⚠ HIGH RISK AREA</p>
                <p className="text-xs text-muted-foreground">12 past incidents within 50 km</p>
              </div>
            </div>
          </div>

          {/* Historical spills table */}
          <div className="bg-background/50 rounded-lg border border-border/30 overflow-hidden">
            <table className="w-full text-xs" role="table" aria-label="Past incidents near this location">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Year</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Distance</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Cause</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium hidden sm:table-cell">Vessel</th>
                </tr>
              </thead>
              <tbody>
                {historicalSpills.map((s) => (
                  <tr key={s.year} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-2.5 font-mono text-foreground">{s.year}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.distance}</td>
                    <td className="px-4 py-2.5">
                      <span className="bg-warning/10 text-warning px-2 py-0.5 rounded text-[10px] font-medium">{s.cause}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{s.vessel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prevention tip */}
          <div className="flex items-start gap-2.5 bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
            <Shield className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-accent font-medium">Prevention tip:</span> Use enhanced navigation systems in shallow coastal zones. Historical groundings in this region correlate with inadequate depth data.
            </p>
          </div>

          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate("/historical-reports")}>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View All Reports
          </Button>
        </div>

        {/* Pie chart */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Cause Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={causeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
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
          <div className="space-y-1.5 mt-2">
            {causeData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} aria-hidden="true" />
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
