'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Vector3 } from 'three';

interface ConceptualSpaceProps {
  xRange: [number, number];
  yRange: [number, number];
  zRange: [number, number];
}

function Space({ xRange, yRange, zRange, onClickSpace }: ConceptualSpaceProps & { onClickSpace: (point: Vector3) => void }) {
  const handleClick = (event: any) => {
    event.stopPropagation();
    const point = event.point as Vector3;
    onClickSpace(point);
  };

  const xSize = xRange[1] - xRange[0];
  const ySize = yRange[1] - yRange[0];
  const zSize = zRange[1] - zRange[0];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Clickable volume */}
      <mesh onClick={handleClick} position={[
        (xRange[0] + xRange[1]) / 2,
        (yRange[0] + yRange[1]) / 2,
        (zRange[0] + zRange[1]) / 2
      ]}>
        <boxGeometry args={[xSize, ySize, zSize]} />
        <meshStandardMaterial transparent opacity={0.1} color="#4488ff" />
      </mesh>

      {/* Grid helpers for each plane */}
      <Grid
        position={[0, yRange[0], 0]}
        args={[xSize, zSize]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
      />

      <OrbitControls makeDefault />
    </>
  );
}

export default function ConceptualSpace({ xRange, yRange, zRange }: ConceptualSpaceProps) {
  const handleClickSpace = (point: Vector3) => {
    console.log('Clicked at:', {
      x: point.x,
      y: point.y,
      z: point.z
    });
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <Space
          xRange={xRange}
          yRange={yRange}
          zRange={zRange}
          onClickSpace={handleClickSpace}
        />
      </Canvas>
    </div>
  );
}
