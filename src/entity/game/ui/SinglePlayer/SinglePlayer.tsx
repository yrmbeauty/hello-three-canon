import { useState, useRef, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

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
    const plusX = layerDirection.current === "x" ? LAYER_INITIAL_POS : 0;
    const plusZ = layerDirection.current === "z" ? LAYER_INITIAL_POS : 0;
    const newY = lastLayer.position[1] + LAYER_GAP;
    const newPos: [number, number, number] = [plusX, newY, plusZ];
    activeLayerRef.current?.position.set(...newPos);

    // Set new active layer size
    setLayerSize(lastLayer.size);
  };

  const addLayer = useCallback(() => {
    if (!activeLayerRef.current) return;
    const newLayers = [
      ...layers,
      {
        size: layerSize,
        position: [
          activeLayerRef.current.position.x,
          activeLayerRef.current.position.y,
          activeLayerRef.current.position.z,
        ],
      } as ILayer,
    ];

    setLayers(newLayers);
    setActiveLayer(newLayers[newLayers.length - 1]);
  }, [setLayers, layers]);

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
