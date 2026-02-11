import { useNavigate } from "react-router-dom";
import { Droplets, Radio, Activity, Cpu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center glow-accent">
            <Droplets className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              OceanGuard AI
            </h1>
            <p className="text-xs text-muted-foreground">📊 Oil Spill Detection Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SystemIndicator icon={<Cpu className="w-3.5 h-3.5" />} label="CPU-only" />
          <SystemIndicator icon={<Radio className="w-3.5 h-3.5" />} label="Open-Source" />
          <SystemIndicator icon={<Activity className="w-3.5 h-3.5" />} label="Real-Time Ready" />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-1.5 ml-2"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

const SystemIndicator = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
    <span className="w-1.5 h-1.5 rounded-full bg-success status-pulse" />
    {icon}
    <span>{label}</span>
  </div>
);

export default Header;
