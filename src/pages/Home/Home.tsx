import Instructions from "entity/game/ui/Instructions/Instructions";
import Results from "entity/game/ui/Results/Results";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-300">
      <Instructions />
      <Results />
      <div className="py-8 px-8">0</div>
    </main>
  );
};

export default Home;
