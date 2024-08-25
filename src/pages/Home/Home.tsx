import { useState } from "react";
import { Canvas } from "@react-three/fiber";

// import Instructions from "entity/interface/ui/Instructions/Instructions";
import Results from "entity/interface/ui/Results/Results";
import Scene from "entity/game/ui/Scene/Scene";
import SinglePlayer from "entity/game/ui/SinglePlayer/SinglePlayer";

const Home: React.FC = () => {
  const [gameState, setGameState] = useState<
    "pause" | "running" | "end" | "autoplay"
  >("autoplay");
  const [score, setScore] = useState(0);

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-300 text-black dark:bg-black dark:text-white">
      <div className="absolute right-28 top-12 text-6xl z-10">{score}</div>
      {/* {gameState === "autoplay" && (
        <Instructions className="absolute max-w-screen-sm top-1/4 z-10" />
      )} */}
      {gameState === "end" && <Results />}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [0.1, 4, 0.1], fov: 60 }} shadows>
          <Scene />
          <SinglePlayer />
        </Canvas>
      </div>
    </main>
  );
};

export default Home;
