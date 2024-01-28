import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import * as THREE from "three";

interface Props {
  gameState: "pause" | "running" | "end";
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const SinglePlayer: React.FC<Props> = () => {
  // const { gameState, setScore } = props;

  // const [layers, setLayers] = useState([]);

  // function pushLayer() {}

  return (
    <div id="canvas-container" className="w-full h-screen">
      <Canvas camera={{ position: [0.1, 4, 0.1], fov: 60 }} shadows>
        <directionalLight
          position={[0, 15, 0]}
          shadow-bias={-0.001}
          intensity={2}
          castShadow
        />
        <hemisphereLight position={[0, 15, 0]} />

        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.5, 2]} />
          <meshStandardMaterial attach="material" color="orange" flatShading />
        </mesh>

        <mesh position={[0, -1, 0]} receiveShadow>
          <boxGeometry args={[60, 0, 60]} />
          <meshStandardMaterial attach="material" color="grey" flatShading />
        </mesh>

        <OrbitControls
          // enableRotate={false}
          minPolarAngle={Math.PI / 4.5}
          maxPolarAngle={Math.PI / 4.55}
        />
      </Canvas>
    </div>
  );
};

export default SinglePlayer;
