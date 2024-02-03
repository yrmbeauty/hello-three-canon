import { LAYER_SIZE } from "widgets/game/SinglePlayer/SinglePlayer.constants";
import type { Layer as ILayer } from "entity/game/types/game";

const Layer: React.FC<ILayer> = props => {
  const { position, size } = props;

  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size || LAYER_SIZE} />
      <meshStandardMaterial attach="material" color="orange" flatShading />
    </mesh>
  );
};

export default Layer;
