import { useState, useRef, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Layer, { LayerRef } from "entity/game/ui/Layer/Layer";
import type { Layer as ILayer } from "entity/game/types/game";
import {
  LAYER_GAP,
  LAYER_INITIAL_POS,
  LAYER_SIZE,
  VELOCITY,
} from "./SinglePlayer.constants";

const SinglePlayer: React.FC = () => {
  const [layers, setLayers] = useState<ILayer[]>([
    { position: [0, 0, 0], size: LAYER_SIZE },
  ]);
  const lastLayer = layers[layers.length - 1];

  const layerDirection = useRef<"x" | "z">("x");
  const activeLayerRef = useRef<LayerRef>(null);
  const [layerSize, setLayerSize] = useState(LAYER_SIZE);

  useFrame(() => {
    if (!activeLayerRef.current) return;
    // Move active layer position
    const plusX = layerDirection.current === "x" ? VELOCITY : 0;
    const plusZ = layerDirection.current === "z" ? VELOCITY : 0;
    const newPos: [number, number, number] = [
      activeLayerRef.current.position.x + plusX,
      activeLayerRef.current.position.y,
      activeLayerRef.current.position.z + plusZ,
    ];
    activeLayerRef.current.position.set(...newPos);
  });

  const setActiveLayer = (lastLayer: ILayer) => {
    // Change to opposit active layer slide direction
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

    setLayerSize(newLayer.size);
    setActiveLayer(newLayers[newLayers.length - 1]);
    setLayers(newLayers);
  }, [setLayers, layers, layerSize]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        addLayer();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [addLayer]);

  return (
    <>
      <Layer
        key={"activeLayer"}
        ref={activeLayerRef}
        position={[LAYER_INITIAL_POS, LAYER_GAP, 0]}
        size={layerSize}
      />

      {layers.map(({ position, size }, idx) => (
        <Layer key={idx} position={position} size={size} />
      ))}
    </>
  );
};

export default SinglePlayer;
