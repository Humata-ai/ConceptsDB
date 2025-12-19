'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { MeshData, createLineGeometry } from '../utils/appleShape';

interface ShapeGraphProps {
  meshData: MeshData;
  unit?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  meshColor?: string;
  meshOpacity?: number;
  wireframe?: boolean;
  gridRange?: [number, number, number];
  gridDivisions?: number;
  axisColors?: {
    x?: string;
    y?: string;
    z?: string;
  };
}

function ShapeGraphMesh({
  meshData,
  unit = 'cm',
  showAxes = true,
  showGrid = true,
  showLabels = true,
  meshColor = '#4488ff',
  meshOpacity = 0.8,
  wireframe = false,
  gridRange = [10, 10, 10],
  gridDivisions = 10,
  axisColors = {},
}: ShapeGraphProps) {
  const {
    x: xColor = '#ff0000',
    y: yColor = '#00ff00',
    z: zColor = '#0000ff',
  } = axisColors;

  const [xMax, yMax, zMax] = gridRange;

  // Create custom mesh geometry from MeshData
  const meshGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    // Set vertices
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(meshData.vertices, 3)
    );

    // Set indices
    geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1));

    // Compute or set normals
    if (meshData.normals) {
      geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(meshData.normals, 3)
      );
    } else {
      geometry.computeVertexNormals();
    }

    geometry.computeBoundingBox();
    return geometry;
  }, [meshData]);

  // Create 3D axes
  const axes = useMemo(() => {
    if (!showAxes) return [];

    return [
      { geometry: createLineGeometry([0, 0, 0], [xMax, 0, 0]), color: xColor, label: 'X', position: [xMax + 0.5, 0, 0] as [number, number, number] },
      { geometry: createLineGeometry([0, 0, 0], [0, yMax, 0]), color: yColor, label: 'Y', position: [0, yMax + 0.5, 0] as [number, number, number] },
      { geometry: createLineGeometry([0, 0, 0], [0, 0, zMax]), color: zColor, label: 'Z', position: [0, 0, zMax + 0.5] as [number, number, number] },
    ];
  }, [showAxes, xMax, yMax, zMax, xColor, yColor, zColor]);

  // Create grid lines on XY plane (Z=0)
  const gridLines = useMemo(() => {
    if (!showGrid) return [];

    const lines: THREE.BufferGeometry[] = [];

    // Lines parallel to Y axis (varying X)
    for (let i = 0; i <= gridDivisions; i++) {
      const x = (i / gridDivisions) * xMax;
      lines.push(createLineGeometry([x, 0, 0], [x, yMax, 0]));
    }

    // Lines parallel to X axis (varying Y)
    for (let i = 0; i <= gridDivisions; i++) {
      const y = (i / gridDivisions) * yMax;
      lines.push(createLineGeometry([0, y, 0], [xMax, y, 0]));
    }

    return lines;
  }, [showGrid, xMax, yMax, gridDivisions]);

  // Create tick labels
  const tickLabels = useMemo(() => {
    if (!showLabels) return [];

    const labels: Array<{
      position: [number, number, number];
      text: string;
      rotation?: [number, number, number];
    }> = [];

    // Calculate appropriate tick interval (aim for ~5-10 ticks)
    const tickInterval = Math.max(1, Math.ceil(Math.max(xMax, yMax, zMax) / 10));

    // X-axis labels
    for (let x = 0; x <= xMax; x += tickInterval) {
      labels.push({
        position: [x, -0.5, 0],
        text: `${x}${unit}`,
        rotation: [-Math.PI / 2, 0, 0],
      });
    }

    // Y-axis labels
    for (let y = 0; y <= yMax; y += tickInterval) {
      labels.push({
        position: [-0.5, y, 0],
        text: `${y}${unit}`,
        rotation: [-Math.PI / 2, 0, 0],
      });
    }

    // Z-axis labels
    for (let z = 0; z <= zMax; z += tickInterval) {
      labels.push({
        position: [0, -0.5, z],
        text: `${z}${unit}`,
        rotation: [-Math.PI / 2, 0, 0],
      });
    }

    return labels;
  }, [showLabels, xMax, yMax, zMax, unit]);

  return (
    <group>
      {/* Grid lines */}
      {gridLines.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types for lowercase elements
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#cccccc" opacity={0.3} transparent />
        </line>
      ))}

      {/* Axes */}
      {axes.map((axis, i) => (
        <group key={`axis-${i}`}>
          {/* @ts-expect-error - React Three Fiber JSX types for lowercase elements */}
          <line geometry={axis.geometry}>
            <lineBasicMaterial color={axis.color} linewidth={2} />
          </line>
          {/* Axis label */}
          <Text
            position={axis.position}
            fontSize={0.4}
            color={axis.color}
            anchorX="center"
            anchorY="middle"
          >
            {axis.label}
          </Text>
        </group>
      ))}

      {/* Tick labels */}
      {tickLabels.map((label, i) => (
        <Text
          key={`label-${i}`}
          position={label.position}
          rotation={label.rotation}
          fontSize={0.25}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}

      {/* Custom mesh */}
      <mesh geometry={meshGeometry} position={[xMax / 2, yMax / 2, zMax / 2]}>
        <meshStandardMaterial
          color={meshColor}
          opacity={meshOpacity}
          transparent={meshOpacity < 1}
          wireframe={wireframe}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ShapeGraph(props: ShapeGraphProps) {
  const [xMax, yMax, zMax] = props.gridRange || [10, 10, 10];
  const centerX = xMax / 2;
  const centerY = yMax / 2;
  const centerZ = zMax / 2;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [xMax * 1.2, yMax * 1.2, zMax * 1.2],
          fov: 50,
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls
          makeDefault
          target={[centerX, centerY, centerZ]}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
        <ShapeGraphMesh {...props} />
      </Canvas>
    </div>
  );
}
