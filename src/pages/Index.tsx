import Header from "@/components/dashboard/Header";
import SARUpload from "@/components/dashboard/SARUpload";
import PhysicsValidation from "@/components/dashboard/PhysicsValidation";
import StatisticalClassifier from "@/components/dashboard/StatisticalClassifier";
import TrajectoryMap from "@/components/dashboard/TrajectoryMap";
import HistoricalContext from "@/components/dashboard/HistoricalContext";
import DecisionSummary from "@/components/dashboard/DecisionSummary";

const Index = () => {
  return (
    <div className="min-h-screen ocean-gradient">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl" role="main">
        <SARUpload />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PhysicsValidation />
          <StatisticalClassifier />
        </div>
        <TrajectoryMap />
        <HistoricalContext />
        <DecisionSummary />
      </main>
    </div>
  );
};

export default Index;
