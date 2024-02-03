export type GameState = "pause" | "running" | "end" | "autoplay";

export interface Layer {
  position: [number, number, number];
  size: [number, number, number];
}
