'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

interface TasteValues {
  sweet: number;
  sour: number;
  salty: number;
  bitter: number;
  umami: number;
}

interface TasteSpiderChartProps {
  tasteValues: TasteValues;
  radius?: number;
  showGrid?: boolean;
  gridLevels?: number;
  fillColor?: string;
  fillOpacity?: number;
}

const TASTE_NAMES = ['sweet', 'sour', 'salty', 'bitter', 'umami'] as const;

function SpiderChartMesh({
  tasteValues,
  radius = 2,
  showGrid = true,
  gridLevels = 5,
  fillColor = '#4488ff',
  fillOpacity = 0.6,
}: TasteSpiderChartProps) {
  // Helper function to calculate position on the spider chart
  const getPosition = (index: number, distance: number): [number, number, number] => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
  };

  // Create radial axes
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

  // Create concentric grid pentagons
  const gridLines = useMemo(() => {
    if (!showGrid) return [];

    const grids: THREE.BufferGeometry[] = [];
    for (let level = 1; level <= gridLevels; level++) {
      const levelRadius = (level / gridLevels) * radius;
      const positions: number[] = [];

      // Create pentagon by connecting 5 points + return to first point
      for (let i = 0; i <= 5; i++) {
        const [x, y, z] = getPosition(i % 5, levelRadius);
        positions.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      grids.push(geometry);
    }
    return grids;
  }, [radius, showGrid, gridLevels]);

  // Create filled taste pentagon
  const tastePentagon = useMemo(() => {
    const positions: number[] = [];
    const vertices: THREE.Vector3[] = [];

    // Calculate vertices based on taste values
    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      vertices.push(new THREE.Vector3(x, 0.01, z)); // Slight Y offset to prevent z-fighting
    });

    // Create triangles for filled pentagon (fan triangulation from center)
    const center = new THREE.Vector3(0, 0.01, 0);
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      // Triangle: center -> current -> next
      positions.push(center.x, center.y, center.z);
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
      positions.push(vertices[next].x, vertices[next].y, vertices[next].z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.computeVertexNormals();

    return { geometry, vertices };
  }, [tasteValues, radius]);

  // Create outline for taste pentagon
  const outlineGeometry = useMemo(() => {
    const positions: number[] = [];

    // Use the vertices from tastePentagon to create outline
    TASTE_NAMES.forEach((taste, i) => {
      const value = tasteValues[taste];
      const [x, y, z] = getPosition(i, radius * value);
      positions.push(x, 0.01, z);
    });

    // Close the loop by adding first point at the end
    const value = tasteValues[TASTE_NAMES[0]];
    const [x, y, z] = getPosition(0, radius * value);
    positions.push(x, 0.01, z);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geometry;
  }, [tasteValues, radius]);

  return (
    <group>
      {/* Radial axes */}
      {axes.map((geometry, i) => (
        <line key={`axis-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Concentric grid */}
      {gridLines.map((geometry, i) => (
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#888888" opacity={0.4} transparent />
        </line>
      ))}

      {/* Filled taste pentagon */}
      <mesh geometry={tastePentagon.geometry}>
        <meshBasicMaterial
          color={fillColor}
          opacity={fillOpacity}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Pentagon outline */}
      <line geometry={outlineGeometry}>
        <lineBasicMaterial color="#2266cc" />
      </line>

      {/* Taste labels */}
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

export default function TasteSpiderChart(props: TasteSpiderChartProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 3, 3],
          fov: 50,
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={8}
        />
        <SpiderChartMesh {...props} />
      </Canvas>
    </div>
  );
}
