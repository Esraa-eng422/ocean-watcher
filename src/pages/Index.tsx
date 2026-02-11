import Header from "@/components/dashboard/Header";
import SARUpload from "@/components/dashboard/SARUpload";
import TrajectoryMap from "@/components/dashboard/TrajectoryMap";
import MLClassification from "@/components/dashboard/MLClassification";
import HistoricalContext from "@/components/dashboard/HistoricalContext";
import FinalReport from "@/components/dashboard/FinalReport";

const Index = () => {
  return (
    <div className="min-h-screen ocean-gradient">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <SARUpload />
        <TrajectoryMap />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MLClassification />
          <HistoricalContext />
        </div>
        <FinalReport />
      </main>
    </div>
  );
};

export default Index;
