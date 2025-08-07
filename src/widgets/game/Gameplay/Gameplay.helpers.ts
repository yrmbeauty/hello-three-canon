import { AUTO_PLAY_ACCURACY } from "./Gameplay.constants";

export const generateAutoplayAccuracy = () => {
  return (
    Math.floor(
      Math.random() * (AUTO_PLAY_ACCURACY[1] - AUTO_PLAY_ACCURACY[0] + 1) +
        AUTO_PLAY_ACCURACY[0],
    ) / 100
  );
};
