'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

function ColorCubeMesh() {
  // Generate 3D texture data with RGB values
  const texture = useMemo(() => {
    const size = 64; // 64x64x64 voxel resolution
    const data = new Uint8Array(size * size * size * 4); // RGBA format

    // Fill texture data: each voxel's color corresponds to its 3D position
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (z * size * size + y * size + x) * 4;
          // Normalize coordinates to [0, 255] range
          data[index] = (x / (size - 1)) * 255;     // Red channel (X axis)
          data[index + 1] = (y / (size - 1)) * 255; // Green channel (Y axis)
          data[index + 2] = (z / (size - 1)) * 255; // Blue channel (Z axis)
          data[index + 3] = 255;                    // Alpha (fully opaque)
        }
      }
    }

    const texture3D = new THREE.Data3DTexture(data, size, size, size);
    texture3D.format = THREE.RGBAFormat;
    texture3D.type = THREE.UnsignedByteType;
    texture3D.minFilter = THREE.LinearFilter;
    texture3D.magFilter = THREE.LinearFilter;
    texture3D.needsUpdate = true;

    return texture3D;
  }, []);

  // Create custom shader material for 3D texture sampling
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: { value: texture }
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          // Normalize position from [-0.5, 0.5] to [0, 1] for texture sampling
          vPosition = position + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform highp sampler3D colorTexture;
        varying vec3 vPosition;

        void main() {
          // Sample the 3D texture at the current position
          gl_FragColor = texture(colorTexture, vPosition);
        }
      `,
      side: THREE.FrontSide,
    });
  }, [texture]);

  return (
    <mesh position={[0.5, 0.5, 0.5]} material={material}>
      <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
    </mesh>
  );
}

export default function RGBColorCube() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [2, 2, 2], fov: 50 }}
        gl={{ antialias: true }}
      >
        <OrbitControls
          makeDefault
          target={[0.5, 0.5, 0.5]}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={5}
        />

        {/* Ambient light for general illumination */}
        <ambientLight intensity={0.5} />

        {/* The RGB color cube */}
        <ColorCubeMesh />
      </Canvas>
    </div>
  );
}
