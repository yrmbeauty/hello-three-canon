import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Layer from "entity/game/ui/Layer/Layer";
import type { GameState, Layer as ILayer } from "entity/game/types/game";
import {
  AUTO_PLAY_ACCURACY,
  LAYER_GAP,
  LAYER_INITIAL_POS,
  LAYER_SIZE,
  LayerRef,
  VELOCITY,
} from "./SinglePlayer.constants";

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<
    React.SetStateAction<"pause" | "running" | "end" | "autoplay">
  >;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const SinglePlayer: React.FC<Props> = props => {
  const { gameState, setGameState } = props;

  const [isAutoplay, isPaused, isRunning, isEnd] = [
    gameState === "autoplay",
    gameState === "pause",
    gameState === "running",
    gameState === "end",
  ];

  const [layers, setLayers] = useState<ILayer[]>([]);
  const [layerSize, setLayerSize] = useState(LAYER_SIZE);

  const layerDirection = useRef<"x" | "z">("x");
  const layerRef = useRef<LayerRef>(null);

  useFrame(() => {
    const isFirstLayer =
      layerRef.current?.position.x === 0 &&
      layerRef.current?.position.y === 0 &&
      layerRef.current?.position.z === 0;

    let isStop = false;
    if (layers.length && isAutoplay) {
      const lastLayer = layers[layers.length - 1];
      const lastLayerCenter =
        layerDirection.current === "x"
          ? lastLayer.position[0]
          : lastLayer.position[2];
      const activeLayerPos =
        layerDirection.current === "x"
          ? layerRef.current?.position.x!
          : layerRef.current?.position.z!;

      isStop = !(
        lastLayerCenter - AUTO_PLAY_ACCURACY >= activeLayerPos ||
        lastLayerCenter + AUTO_PLAY_ACCURACY <= activeLayerPos
      );

      if (isStop) {
        addLayer();
      }
    }

    if (isPaused || isEnd || isFirstLayer || isStop) return;

    // Move active layer position
    const plusX = layerDirection.current === "x" ? VELOCITY : 0;
    const plusZ = layerDirection.current === "z" ? VELOCITY : 0;
    const newPos: [number, number, number] = [
      layerRef.current?.position.x! + plusX,
      layerRef.current?.position.y!,
      layerRef.current?.position.z! + plusZ,
    ];
    layerRef.current?.position.set(...newPos);
  });

  const setActiveLayer = (layers: ILayer[]) => {
    // Change to opposit active layer slide direction
    if (layerDirection.current === "x") layerDirection.current = "z";
    else layerDirection.current = "x";

    const lastLayer = layers[layers.length - 1];

    // Set new active layer position
    const plusX = layerDirection.current === "x" ? LAYER_INITIAL_POS : 0;
    const plusZ = layerDirection.current === "z" ? LAYER_INITIAL_POS : 0;
    const newY = lastLayer.position[1] + LAYER_GAP;
    const newPos: [number, number, number] = [plusX, newY, plusZ];
    layerRef.current?.position.set(...newPos);

    // Set new active layer size
    setLayerSize(lastLayer.size);
  };

  const addLayer = useCallback(() => {
    setLayers(layers => {
      const position = [
        layerRef.current?.position.x,
        layerRef.current?.position.y,
        layerRef.current?.position.z,
      ];

      const newLayers = [
        ...layers,
        {
          size: layerSize,
          position,
        } as ILayer,
      ];

      setActiveLayer(newLayers);

      return newLayers;
    });
  }, [setGameState, setLayers]);

  const startGame = useCallback(() => {
    setLayers(() => {
      const position = [0, 0, 0];

      const newLayers = [
        {
          size: layerSize,
          position,
        } as ILayer,
      ];

      setActiveLayer(newLayers);

      return newLayers;
    });
  }, [setGameState, setLayers]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isAutoplay && !isRunning) {
          setGameState("running");
          startGame();
        } else {
          addLayer();
        }
      }
    },
    [addLayer, layers],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    if (isAutoplay) {
      addLayer();
    }
  }, [isAutoplay]);

  useEffect(() => {
    if (isAutoplay && layers.length === 8) {
      const newLayers = [{ position: [0, 0, 0], size: LAYER_SIZE } as ILayer];
      setLayers(newLayers);
      setActiveLayer(newLayers);
    }
  }, [isAutoplay, layers]);

  useEffect(() => {
    console.log({ layers });
  }, [layers]);

  return (
    <>
      <directionalLight
        position={[0, 50, 0]}
        shadow-bias={-0.001}
        intensity={2}
        castShadow
      />
      <hemisphereLight position={[0, 15, 0]} />

      <mesh ref={layerRef} castShadow>
        <boxGeometry args={layerSize} />
        <meshStandardMaterial attach="material" color="orange" flatShading />
      </mesh>

      {layers.map(({ position, size }, idx) => (
        <Layer key={idx} position={position} size={size} />
      ))}

      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[60, 0, 60]} />
        <meshStandardMaterial attach="material" color="grey" flatShading />
      </mesh>

      <OrbitControls
        enableRotate={false}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 4.55}
      />
    </>
  );
};

export default SinglePlayer;

// for autoplay
//   const isMoving =
//     0 - AUTO_PLAY_ACCURACY >= currentPosCoordValue ||
//     0 + AUTO_PLAY_ACCURACY <= currentPosCoordValue;
