import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useMemo } from "react";

const Scene: React.FC = () => {
  const { left, right, top, bottom } = useMemo(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const width = 10;
    const height = width / aspect;

    return {
      left: width / -2,
      right: width / 2,
      top: height / 2,
      bottom: height / -2,
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} color={0xffffff} />
      <directionalLight
        intensity={0.6}
        color={0xffffff}
        position={[10, 20, 0]}
      />
      <OrbitControls />
      <OrthographicCamera
        makeDefault
        left={left}
        right={right}
        top={top}
        bottom={bottom}
        near={0}
        far={100}
        position={[4, 4, 4]}
      />
    </>
  );
};

export default Scene;
