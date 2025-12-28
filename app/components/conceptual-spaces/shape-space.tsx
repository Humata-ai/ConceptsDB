import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useState, useEffect } from 'react';
import { isIOS, isSafari } from 'react-device-detect';
import { MeshData, createLineGeometry } from '../../utils/appleShape';

interface ShapeSpaceProps {
  meshData: MeshData;
  position?: [number, number, number];
  unit?: string;
}

export default function ShapeSpace({
  meshData,
  position = [0, 0, 0],
  unit = 'cm',
}: ShapeSpaceProps) {
  // Detect iOS Safari for material compatibility
  const [isIOSSafari, setIsIOSSafari] = useState(false);

  useEffect(() => {
    setIsIOSSafari(isIOS && isSafari);
  }, []);

  const meshGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(meshData.vertices, 3));

    // iOS Safari compatibility: Ensure indices are in the correct format
    if (meshData.indices) {
      // Convert to Uint32Array for better iOS compatibility
      const indices = meshData.indices instanceof Uint32Array
        ? meshData.indices
        : new Uint32Array(meshData.indices);
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    if (meshData.normals) {
      geometry.setAttribute('normal', new THREE.BufferAttribute(meshData.normals, 3));
    } else {
      geometry.computeVertexNormals();
    }
    geometry.computeBoundingBox();
    return geometry;
  }, [meshData]);

  const [xMax, yMax, zMax] = [10, 10, 10];

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * xMax;
      const y = (i / 10) * yMax;
      lines.push(createLineGeometry([x, 0, 0], [x, yMax, 0]));
      lines.push(createLineGeometry([0, y, 0], [xMax, y, 0]));
    }
    return lines;
  }, []);

  // Axes
  const axes = useMemo(() => {
    return [
      {
        geometry: createLineGeometry([0, 0, 0], [xMax, 0, 0]),
        color: '#888888',
        label: 'X',
        labelPos: [xMax + 0.5, 0, 0] as [number, number, number],
      },
      {
        geometry: createLineGeometry([0, 0, 0], [0, yMax, 0]),
        color: '#888888',
        label: 'Y',
        labelPos: [0, yMax + 0.5, 0] as [number, number, number],
      },
      {
        geometry: createLineGeometry([0, 0, 0], [0, 0, zMax]),
        color: '#888888',
        label: 'Z',
        labelPos: [0, 0, zMax + 0.5] as [number, number, number],
      },
    ];
  }, []);

  return (
    <group position={position}>
      {/* Grid */}
      {gridLines.map((geometry, i) => (
        // @ts-expect-error - React Three Fiber JSX types
        <line key={`grid-${i}`} geometry={geometry}>
          <lineBasicMaterial color="#cccccc" opacity={0.3} transparent />
        </line>
      ))}

      {/* Axes */}
      {axes.map((axis, i) => (
        <group key={`axis-${i}`}>
          {/* @ts-expect-error - React Three Fiber JSX types */}
          <line geometry={axis.geometry}>
            <lineBasicMaterial color={axis.color} linewidth={2} />
          </line>
          <Text position={axis.labelPos} fontSize={0.4} color={axis.color} anchorX="center" anchorY="middle">
            {axis.label}
          </Text>
        </group>
      ))}

      {/* Mesh */}
      <mesh geometry={meshGeometry} position={[xMax / 2, yMax / 2, zMax / 2]}>
        {/*
          iOS Safari WebGL Compatibility:
          iOS Safari has long-standing issues with lighting-based materials (meshStandardMaterial, meshLambertMaterial)
          due to Metal backend shader compilation differences. These materials often render as black or fail to render.

          Known issues:
          - https://github.com/mrdoob/three.js/issues/17113 (MeshStandardMaterial renders black on iOS)
          - https://github.com/mrdoob/three.js/issues/17918 (MeshStandardMaterial iOS rendering issues)
          - https://github.com/mrdoob/three.js/issues/25741 (WebGL issues after iOS 16.4)
          - https://discourse.threejs.org/t/ios-18-2-causing-webgl-error/75143 (iOS 18.2 WebGL errors)

          Solution: Use meshBasicMaterial for iOS Safari, meshStandardMaterial for other browsers
        */}
        {isIOSSafari ? (
          <meshBasicMaterial color="#cccccc" side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  );
}
