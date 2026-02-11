import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Eye, X, MapPin, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const incidents = [
  {
    id: 1,
    date: "2023-09-14",
    distance: "8 km",
    cause: "Collision",
    vessel: "Unknown tanker",
    risk: "HIGH",
    location: "38.52°N, 20.18°E",
    description: "Two vessels collided near the Ionian Sea strait during low-visibility conditions. Approximately 1,200 tonnes of crude oil were released, forming a 3.8 km² slick that drifted northeast toward the coastline.",
    prevention: "Implement mandatory AIS broadcasting in congested shipping lanes. Deploy additional radar surveillance buoys in high-traffic zones.",
  },
  {
    id: 2,
    date: "2021-06-22",
    distance: "34 km",
    cause: "Equipment Failure",
    vessel: "X-Press Pearl",
    risk: "MEDIUM",
    location: "38.91°N, 20.55°E",
    description: "A cargo vessel experienced catastrophic engine room failure, resulting in a slow leak of heavy fuel oil over 48 hours. An estimated 350 tonnes escaped before containment was deployed.",
    prevention: "Mandate quarterly mechanical inspections for aging vessels. Require double-hull containment for fuel storage on all commercial ships operating in the region.",
  },
  {
    id: 3,
    date: "2019-03-07",
    distance: "12 km",
    cause: "Grounding",
    vessel: "MV Wakashio",
    risk: "HIGH",
    location: "38.65°N, 20.28°E",
    description: "A bulk carrier ran aground on a shallow reef due to inadequate depth sounding data. The hull breach released approximately 800 tonnes of fuel oil into ecologically sensitive waters.",
    prevention: "Use enhanced navigation systems in shallow coastal zones. Update nautical charts with latest bathymetric survey data.",
  },
];

const riskColor: Record<string, string> = {
  HIGH: "bg-danger/10 text-danger border-danger/30",
  MEDIUM: "bg-warning/10 text-warning border-warning/30",
  LOW: "bg-accent/10 text-accent border-accent/30",
};

const HistoricalReports = () => {
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<typeof incidents[0] | null>(null);

  return (
    <div className="min-h-screen ocean-gradient">
      {/* Navbar */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Historical Incident Reports</h1>
            <p className="text-xs text-muted-foreground">📁 Retrieved incidents within 50 km of current detection point</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Distance</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Cause</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider hidden sm:table-cell">Risk</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground">{inc.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inc.distance}</td>
                  <td className="px-4 py-3">
                    <span className="bg-warning/10 text-warning px-2 py-0.5 rounded text-xs">{inc.cause}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${riskColor[inc.risk]}`}>{inc.risk}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setSelectedIncident(inc)}>
                      <Eye className="w-3.5 h-3.5" /> View Full Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Report Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedIncident(null)}>
          <div className="bg-card border border-border/50 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Incident Report — {selectedIncident.date}</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">📍 Location</p>
                  <p className="text-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" /> {selectedIncident.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Vessel</p>
                  <p className="text-foreground">{selectedIncident.vessel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Cause</p>
                  <p className="text-warning font-medium">{selectedIncident.cause}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Distance from Detection</p>
                  <p className="text-foreground">{selectedIncident.distance}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">📋 Description</p>
                <p className="text-muted-foreground leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex items-start gap-2">
                <Shield className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-accent font-semibold mb-1">Prevention Recommendation</p>
                  <p className="text-xs text-muted-foreground">{selectedIncident.prevention}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalReports;
