import { OrbitControls } from "@react-three/drei";

const Scene: React.FC = () => {
  return (
    <>
      <directionalLight
        position={[0, 50, 0]}
        shadow-bias={-0.001}
        intensity={2}
        castShadow
      />
      <hemisphereLight position={[0, 15, 0]} />

      <OrbitControls
        enableRotate={false}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 4.55}
      />

      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[60, 0, 60]} />
        <meshStandardMaterial attach="material" color="grey" flatShading />
      </mesh>
    </>
  );
};

export default Scene;
