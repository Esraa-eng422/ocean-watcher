import { useState } from "react";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";

const featureData = [
  { name: "Elongation", value: 33.2 },
  { name: "Mean Intensity", value: 28.6 },
  { name: "Compactness", value: 22.1 },
  { name: "Std Dev", value: 16.1 },
];

const barColors = ["#22d3ee", "#06b6d4", "#0891b2", "#0e7490"];

const syntheticCases = [
  { id: 1, prediction: "Oil-like", confidence: 99.94 },
  { id: 2, prediction: "Non-oil", confidence: 97.2 },
  { id: 3, prediction: "Oil-like", confidence: 95.8 },
  { id: 4, prediction: "Non-oil", confidence: 88.1 },
  { id: 5, prediction: "Oil-like", confidence: 91.3 },
  { id: 6, prediction: "Non-oil", confidence: 76.5 },
];

const MLClassification = () => {
  const [showSynthetic, setShowSynthetic] = useState(false);

  return (
    <section className="glass-card p-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          ML Classification Result
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prediction card */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Prediction</span>
            <span className="text-xs font-mono bg-danger/10 text-danger px-2 py-0.5 rounded">Oil-like</span>
          </div>
          <div className="text-center py-4">
            <p className="text-4xl font-mono font-bold text-accent">99.94%</p>
            <p className="text-xs text-muted-foreground mt-1">Confidence Score</p>
          </div>
        </div>

        {/* Feature importance */}
        <div className="bg-background/50 rounded-lg border border-border/30 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Feature Importance</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={featureData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 40]} />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
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

      {/* Synthetic test cases toggle */}
      <div className="mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowSynthetic(!showSynthetic)}
        >
          {showSynthetic ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
          {showSynthetic ? "Hide" : "Show"} Synthetic Test Cases
        </Button>

        {showSynthetic && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {syntheticCases.map((c) => (
              <div key={c.id} className="bg-background/50 border border-border/30 rounded-md px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">Sample #{c.id}</p>
                <p className={`text-sm font-medium ${c.prediction === "Oil-like" ? "text-danger" : "text-success"}`}>
                  {c.prediction}
                </p>
                <p className="text-xs font-mono text-accent">{c.confidence}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MLClassification;
