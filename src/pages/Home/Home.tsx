import { useState } from "react";
import { Canvas } from "@react-three/fiber";

import Instructions from "entity/interface/ui/Instructions/Instructions";
import Results from "entity/interface/ui/Results/Results";
import Scene from "entity/game/ui/Scene/Scene";
import SinglePlayer from "entity/game/ui/SinglePlayer/SinglePlayer";
import { GameState } from "entity/game/types/game";

const Home: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("autoplay");
  const [score, setScore] = useState(0);
  const [onClick, setOnClick] = useState<(() => void) | null>(null);

  const handleOnClick = () => {
    onClick?.();
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-300 text-black dark:bg-black dark:text-white">
      <div className="absolute right-28 top-12 text-6xl z-10">{score}</div>
      {gameState === "autoplay" && (
        <Instructions className="absolute max-w-screen-sm top-1/4 z-10" />
      )}
      {gameState === "end" && (
        <Results className="absolute max-w-screen-sm top-1/4 z-10" />
      )}
      <div className="w-full h-screen">
        <Canvas onClick={handleOnClick} shadows>
          <Scene />
          <SinglePlayer
            gameState={gameState}
            setGameState={setGameState}
            setScore={setScore}
            setOnClick={setOnClick}
          />
        </Canvas>
      </div>
    </main>
  );
};

export default Home;
