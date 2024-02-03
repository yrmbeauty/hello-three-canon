import * as THREE from "three";

export const LAYER_GAP = 0.2;
export const LAYER_INITIAL_POS = -10;
export const LAYER_HEIGHT = 0.2;
export const LAYER_SIZE: [number, number, number] = [2, LAYER_HEIGHT, 2];
export const CENTER: [number, number, number] = [0, 0, 0];
export const VELOCITY = 0.02;
export const AUTO_PLAY_ACCURACY = 0.4;

export type LayerRef = THREE.Mesh<
  THREE.BufferGeometry<THREE.NormalBufferAttributes>,
  THREE.Material | THREE.Material[],
  THREE.Object3DEventMap
>;
