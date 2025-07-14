import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Layer, { LayerRef } from "entity/game/ui/Layer/Layer";
import type { GameState, Layer as ILayer } from "entity/game/types/game";
import {
  LAYER_GAP,
  LAYER_INITIAL_POS,
  LAYER_SIZE,
  VELOCITY,
} from "./SinglePlayer.constants";

const AutoplayAccuracy = [-0.1, 2.1];

const getAutoplayAccuracy = () => {
  return (
    Math.random() * (AutoplayAccuracy[1] - AutoplayAccuracy[0]) +
    AutoplayAccuracy[0]
  );
};

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setOnClick: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const SinglePlayer: React.FC<Props> = ({
  gameState,
  setGameState,
  setScore,
  setOnClick,
}) => {
  const [_, setCurrentAutoplayAccuracy] = useState(getAutoplayAccuracy());

  const [layers, setLayers] = useState<ILayer[]>([
    { position: [0, 0, 0], size: LAYER_SIZE },
  ]);
  const lastLayer = layers[layers.length - 1];

  const layerDirection = useRef<"x" | "z">("x");
  const activeLayerRef = useRef<LayerRef | null>(null);
  const [layerSize, setLayerSize] = useState(LAYER_SIZE);

  const currentLayerBounds = useMemo((): {
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
  } | null => {
    if (!lastLayer) return null;
    const { position, size } = lastLayer;
    const xSizesSum = layerSize[0] + size[0];
    const zSizesSum = layerSize[2] + size[2];

    const xMin = lastLayer.position[0] - xSizesSum / 2;
    const xMax = lastLayer.position[0] + xSizesSum / 2;
    const zMin = position[2] - zSizesSum / 2;
    const zMax = position[2] + zSizesSum / 2;
    return { xMin, xMax, zMin, zMax };
  }, [lastLayer, layerSize]);

  useFrame(() => {
    if (!activeLayerRef.current || gameState === "end") return;
    // Move active layer position
    const plusX = layerDirection.current === "x" ? VELOCITY : 0;
    const plusZ = layerDirection.current === "z" ? VELOCITY : 0;
    const newPos: [number, number, number] = [
      activeLayerRef.current.position.x + plusX,
      activeLayerRef.current.position.y,
      activeLayerRef.current.position.z + plusZ,
    ];
    activeLayerRef.current.position.set(...newPos);

    // Check if active layer is out of bounds
    if (currentLayerBounds) {
      const { xMax, zMax } = currentLayerBounds;
      if (newPos[0] > xMax || newPos[2] > zMax) {
        // Handle out of bounds
        if (gameState === "autoplay") {
          restart();
        }
        if (gameState === "running") {
          setGameState("end");
        }
      }
    }
  });

  const restart = () => {
    setLayers([{ position: [0, 0, 0], size: LAYER_SIZE }]);
    setLayerSize(LAYER_SIZE);
    setActiveLayer({ position: [0, 0, 0], size: LAYER_SIZE });
    setScore(0);
  };

  const setActiveLayer = (lastLayer: ILayer) => {
    // Change to opposite active layer slide direction
    if (layerDirection.current === "x") layerDirection.current = "z";
    else layerDirection.current = "x";

    // Set new active layer position
    const plusX =
      layerDirection.current === "x"
        ? LAYER_INITIAL_POS
        : lastLayer.position[0];
    const plusZ =
      layerDirection.current !== "x"
        ? LAYER_INITIAL_POS
        : lastLayer.position[2];
    const newY = lastLayer.position[1] + LAYER_GAP;
    const newPos: [number, number, number] = [plusX, newY, plusZ];
    activeLayerRef.current?.position.set(...newPos);
  };

  const addLayer = useCallback(() => {
    if (!activeLayerRef.current) return;

    // for simplification purposes
    const { lastL, activeL } = {
      lastL: { pos: lastLayer.position, size: lastLayer.size },
      activeL: {
        pos: new THREE.Vector3(...activeLayerRef.current.position),
        size: layerSize,
      },
    };

    const dCoord = layerDirection.current === "x" ? 0 : 2;

    // если двигались по оси X, то берём ширину блока, а если нет (по оси Z) — то глубину
    const size = activeL.size[dCoord];
    // считаем разницу между позициями этих двух блоков
    const delta = activeL.pos[layerDirection.current] - lastL.pos[dCoord];
    // считаем размер свеса
    const overhangSize = Math.abs(delta);
    // размер отрезаемой части
    const overlap = size - overhangSize;

    const newSizeX = layerDirection.current === "x" ? overlap : activeL.size[0];
    const newSizeZ = layerDirection.current !== "x" ? overlap : activeL.size[2];

    const newPosX =
      layerDirection.current === "x"
        ? activeL.pos[layerDirection.current] - delta / 2
        : activeL.pos.x;
    const newPosZ =
      layerDirection.current !== "x"
        ? activeL.pos[layerDirection.current] - delta / 2
        : activeL.pos.z;

    const newLayer: ILayer = {
      size: [newSizeX, layerSize[1], newSizeZ],
      position: [newPosX, activeL.pos.y, newPosZ],
    };

    const newLayers = [...layers, newLayer];

    setScore(score => score + 1);
    setCurrentAutoplayAccuracy(getAutoplayAccuracy());
    setLayerSize(newLayer.size);
    setActiveLayer(newLayers[newLayers.length - 1]);
    setLayers(newLayers);
  }, [setLayers, layers, layerSize]);

  const onPlay = useCallback(() => {
    if (gameState === "autoplay" || gameState === "end") {
      restart();
      setGameState("running");
    }
    if (gameState === "running") {
      if (currentLayerBounds && activeLayerRef.current) {
        const { xMin, zMin } = currentLayerBounds;
        const { x, z } = activeLayerRef.current.position;
        if (x < xMin || z < zMin) {
          setGameState("end");
          return;
        }
      }
      addLayer();
    }
  }, [addLayer, gameState, setGameState, currentLayerBounds]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        onPlay();
      }
    };
    setOnClick(() => onPlay);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onPlay, setOnClick]);

  return (
    <>
      <Layer
        key="activeLayer"
        ref={activeLayerRef}
        position={[LAYER_INITIAL_POS, LAYER_GAP, 0]}
        size={layerSize}
        color={new THREE.Color(`hsl(${30 + layers.length * 4}, 100%, 50%)`)}
      />
      {layers.map(({ position, size }, idx) => (
        <Layer
          key={idx}
          position={position}
          size={size}
          color={new THREE.Color(`hsl(${30 + idx * 4}, 100%, 50%)`)}
        />
      ))}
    </>
  );
};

export default SinglePlayer;
