import Instructions from "entity/game/ui/Instructions/Instructions";
import Results from "entity/game/ui/Results/Results";
import { useState } from "react";
import SinglePlayer from "widgets/game/SinglePlayer/SinglePlayer";

const Home: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameState, setGameState] = useState<"pause" | "running" | "end">(
    "running",
  );
  const [score, setScore] = useState(0);

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-300 text-black dark:bg-black dark:text-white">
      <div className="absolute right-28 top-12 text-6xl z-10">{score}</div>
      {gameState === "pause" && (
        <Instructions className="absolute max-w-screen-sm top-1/4 z-10" />
      )}
      {gameState === "end" && <Results />}
      <SinglePlayer gameState={gameState} setScore={setScore} />
    </main>
  );
};

export default Home;
