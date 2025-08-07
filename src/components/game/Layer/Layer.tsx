import * as THREE from "three";
import type { Layer as ILayer } from "app/types/game";
import { forwardRef } from "react";

export type LayerRef = THREE.Mesh<
  THREE.BufferGeometry<THREE.NormalBufferAttributes>,
  THREE.Material | THREE.Material[],
  THREE.Object3DEventMap
>;

const Layer = forwardRef<
  LayerRef,
  Partial<ILayer & { color: string | THREE.Color }>
>((props, _ref) => {
  const { position, size, color = "orange" } = props;

  return (
    <mesh ref={_ref} position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial attach="material" color={color} flatShading />
    </mesh>
  );
});

Layer.displayName = "Layer";

export default Layer;
