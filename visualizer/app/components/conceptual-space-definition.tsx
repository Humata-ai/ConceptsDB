'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import ShapeSpace from './conceptual-spaces/shape-space';
import TasteSpace from './conceptual-spaces/taste-space';
import ColorSpace from './conceptual-spaces/color-space';
import BoundingBox from './conceptual-spaces/bounding-box';
import ConnectionLine from './conceptual-spaces/connection-line';
import { loadOBJ, scaleMeshData, calculateBoundingBox } from '../utils/objParser';
import { MeshData } from '../utils/appleShape';
import { DictionaryItem } from '../types/dictionary';

// Layout configuration
const CENTER_POS: [number, number, number] = [0, 0, 5]; // Front and center at eye level
const RADIUS = 15;
const BACKGROUND_Z = -20; // Push graphs into background
const ANGLE_OFFSET = -Math.PI / 2; // Start from top

// Calculate circular positions (120° apart) - in background
const tasteAngle = 0 + ANGLE_OFFSET;
const colorAngle = (2 * Math.PI / 3) + ANGLE_OFFSET;
const shapeAngle = (4 * Math.PI / 3) + ANGLE_OFFSET;

const POSITIONS = {
  taste: [
    0, // Centered horizontally
    -12, // Much further below the center text
    -15 // Much closer to apple
  ] as [number, number, number],

  color: [
    Math.cos(colorAngle) * RADIUS,
    3, // Upper left
    Math.sin(colorAngle) * RADIUS + BACKGROUND_Z
  ] as [number, number, number],

  shape: [
    Math.cos(shapeAngle) * RADIUS,
    3, // Upper right
    Math.sin(shapeAngle) * RADIUS + BACKGROUND_Z
  ] as [number, number, number],
};

// Styling constants
const COLORS = {
  centerText: '#333333',
  connectionLine: '#666666',
  boundingBox: '#444444',
  spaceTitle: '#222222',
  mainTitle: '#000000',
};

const FONT_SIZES = {
  centerNode: 2.5, // Large and prominent at center
  spaceTitle: 0.8,
};

interface ConceptualSpaceDefinitionProps {
  word: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function ConceptualSpaceDefinition({
  word,
  width = '100vw',
  height = '100vh',
  className,
}: ConceptualSpaceDefinitionProps) {
  const [dictionaryData, setDictionaryData] = useState<DictionaryItem | null>(null);
  const [meshData, setMeshData] = useState<MeshData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWord() {
      setLoading(true);
      setError(null);
      setDictionaryData(null);
      setMeshData(null);

      try {
        // Dynamic import of dictionary file
        const module = await import(`../dictionary/${word}.json`);
        const data = module.default as DictionaryItem;

        // Validate dictionary structure
        if (!data.shape || !data.taste || !data.color) {
          throw new Error(`Invalid dictionary format for "${word}"`);
        }

        setDictionaryData(data);

        // Load the OBJ file
        // Model: "Apple Fruit 3D" by Pixel (https://sketchfab.com/stefan.lengyel1)
        // Licensed under CC Attribution: https://creativecommons.org/licenses/by/4.0/
        // Source: https://sketchfab.com/3d-models/apple-fruit-3d-3cb3ac28e00940cca19f4d0566d34be5
        const mesh = await loadOBJ(data.shape.modelPath);

        // Check the bounding box to determine scale
        const bbox = calculateBoundingBox(mesh);
        console.log(`Original ${word} size:`, bbox.size);

        // Scale to target size from dictionary
        const currentSize = Math.max(...bbox.size);
        const targetSize = data.shape.targetSize;
        const scale = targetSize / currentSize;

        const scaledMesh = scaleMeshData(mesh, scale);
        const scaledBbox = calculateBoundingBox(scaledMesh);
        console.log(`Scaled ${word} size (${data.shape.unit}):`, scaledBbox.size);

        setMeshData(scaledMesh);
        setLoading(false);
      } catch (err: any) {
        console.error(`Error loading ${word}:`, err);

        if (err.code === 'MODULE_NOT_FOUND' || err.message?.includes('Cannot find module')) {
          setError(`Word "${word}" not found in dictionary`);
        } else if (err.message?.includes('Invalid dictionary format')) {
          setError(err.message);
        } else {
          setError(`Failed to load "${word}": ${err.message || 'Unknown error'}`);
        }

        setLoading(false);
      }
    }

    loadWord();
  }, [word]);

  // Loading state
  if (loading) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#666',
        }}
      >
        Loading {word} definition...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: '1.5rem',
          color: '#ff0000',
          gap: '1rem',
        }}
      >
        <div>{error}</div>
        <div style={{ fontSize: '1rem', color: '#666' }}>
          Make sure {word}.json exists in the dictionary folder
        </div>
      </div>
    );
  }

  // Loaded state - render visualization
  if (!dictionaryData || !meshData) {
    return null;
  }

  return (
    <div className={className} style={{ width, height, position: 'relative' }}>
      {/* HTML Title Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          fontSize: '0.9rem',
          color: '#666',
          fontWeight: 500,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        Conceptual Space Definition of {dictionaryData.name}
      </div>

      <Canvas
        camera={{
          position: [0, 0, 60],
          fov: 50,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['white']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />

        <OrbitControls
          makeDefault
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* Center Node - Front and center */}
        <Text
          position={CENTER_POS}
          fontSize={FONT_SIZES.centerNode}
          color={COLORS.centerText}
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          {dictionaryData.name}
        </Text>

        {/* Connecting Lines to background graphs */}
        <ConnectionLine
          start={CENTER_POS}
          end={POSITIONS.taste}
          color={COLORS.connectionLine}
        />
        <ConnectionLine
          start={CENTER_POS}
          end={POSITIONS.color}
          color={COLORS.connectionLine}
        />
        <ConnectionLine
          start={CENTER_POS}
          end={POSITIONS.shape}
          color={COLORS.connectionLine}
        />

        {/* Taste Space - Below (rotated upright) */}
        <group position={POSITIONS.taste} rotation={[Math.PI / 2, 0, 0]}>
          <TasteSpace tasteValues={dictionaryData.taste} radius={3} />
          <BoundingBox size={[7.5, 0.2, 7.5]} position={[0, 0, 0]} color={COLORS.boundingBox} />
          <Text
            position={[0, 0, -4]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={FONT_SIZES.spaceTitle}
            color={COLORS.spaceTitle}
            fontWeight="bold"
            anchorX="center"
            anchorY="bottom"
          >
            Taste
          </Text>
        </group>

        {/* Color Space - Bottom Left */}
        <group position={POSITIONS.color} scale={5}>
          <ColorSpace highlightColor={dictionaryData.color} />
          <BoundingBox size={[1, 1, 1]} position={[0.5, 0.5, 0.5]} color={COLORS.boundingBox} />
          <Text
            position={[0.5, 1.2, 0.5]}
            fontSize={FONT_SIZES.spaceTitle / 5}
            color={COLORS.spaceTitle}
            fontWeight="bold"
            anchorX="center"
            anchorY="bottom"
          >
            Color
          </Text>
        </group>

        {/* Shape Space - Bottom Right */}
        <group position={POSITIONS.shape} scale={0.5}>
          <ShapeSpace meshData={meshData} unit={dictionaryData.shape.unit} />
          <BoundingBox size={[10, 10, 10]} position={[5, 5, 5]} color={COLORS.boundingBox} />
          <Text
            position={[5, 11, 5]}
            fontSize={FONT_SIZES.spaceTitle * 2}
            color={COLORS.spaceTitle}
            fontWeight="bold"
            anchorX="center"
            anchorY="bottom"
          >
            Shape
          </Text>
        </group>
      </Canvas>
    </div>
  );
}
