import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const TASTE_NAMES = ['sweet', 'sour', 'salty', 'bitter', 'umami'] as const;

interface TasteSpaceProps {
  tasteValues: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    umami: number;
  };
  position?: [number, number, number];
  radius?: number;
}

export default function TasteSpace({
  tasteValues,
  position = [0, 0, 0],
  radius = 2,
}: TasteSpaceProps) {
  const getPosition = (index: number, distance: number): [number, number, number] => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
  };

  const axes = useMemo(() => {
    const axesGeometry: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BufferGeometry();
      const [x, y, z] = getPosition(i, radius);
      const positions = new Float32Array([0, 0, 0, x, y, z]);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      axesGeometry.push(geometry);
    }
    return axesGeometry;
  }, [radius]);

  const gridLines = useMemo(() => {
    const grids: THREE.BufferGeometry[] = [];
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (level / 5) * radius;
      const positions: number[] = [];
      for (let i = 0; i <= 5; i++) {
        const [x, y, z] = getPosition(i % 5, levelRadius);
        positions.push(x, y, z);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      grids.push(geometry);
    }
    return grids;
  }, [radius]);

  const tastePentagon = useMemo(() => {
    const positions: number[] = [];
    const vertices: THREE.Vector3[] = [];

    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      vertices.push(new THREE.Vector3(x, 0.01, z));
    });

    const center = new THREE.Vector3(0, 0.01, 0);
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      positions.push(center.x, center.y, center.z);
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
      positions.push(vertices[next].x, vertices[next].y, vertices[next].z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.computeVertexNormals();

    return { geometry, vertices };
  }, [tasteValues, radius]);

  const outlineGeometry = useMemo(() => {
    const positions: number[] = [];
    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      positions.push(x, 0.01, z);
    });
    const value = tasteValues[TASTE_NAMES[0]];
    const [x, y, z] = getPosition(0, radius * value);
    positions.push(x, 0.01, z);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geometry;
  }, [tasteValues, radius]);

  return (
    <group position={position}>
      {/* Axes */}
      {axes.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`axis-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Grid */}
      {gridLines.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Filled pentagon */}
      <mesh geometry={tastePentagon.geometry}>
        <meshBasicMaterial color="#4488ff" opacity={0.6} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Outline */}
      {/* @ts-expect-error - React Three Fiber JSX types */}
      <line geometry={outlineGeometry}>
        <lineBasicMaterial color="#2266cc" />
      </line>

      {/* Labels */}
      {TASTE_NAMES.map((taste, i) => {
        const [x, y, z] = getPosition(i, radius * 1.2);
        const displayName = taste.charAt(0).toUpperCase() + taste.slice(1);
        return (
          <Text
            key={`label-${i}`}
            position={[x, 0.1, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color="#333333"
            anchorX="center"
            anchorY="middle"
          >
            {displayName}
          </Text>
        );
      })}
    </group>
  );
}
