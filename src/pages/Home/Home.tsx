import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";

import { GameState } from "app/types/game";
import Gameplay from "widgets/game/Gameplay/Gameplay";
import Instructions from "components/interface/Instructions/Instructions";
import Results from "components/interface/Results/Results";
import Scene from "components/game/Scene/Scene";

const Home: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("autoplay");
  const [score, setScore] = useState(0);
  const [onClick, setOnClick] = useState<(() => void) | null>(null);

  const handleOnKeyDown = () => {
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
        <Canvas
          onKeyDown={handleOnKeyDown}
          onTouchStart={handleOnKeyDown}
          shadows
          onCreated={({ camera }) => {
            camera.lookAt(0, 0, 0);
          }}
        >
          <Physics broadphase="SAP">
            <Scene />
            <Gameplay
              gameState={gameState}
              setGameState={setGameState}
              setScore={setScore}
              setOnClick={setOnClick}
            />
          </Physics>
        </Canvas>
      </div>
    </main>
  );
};

export default Home;
