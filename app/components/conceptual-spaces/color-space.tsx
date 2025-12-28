import { useMemo, useState, useEffect } from 'react';
import type * as THREE from 'three';
import type { ColorSpaceProps, LoadedMesh } from './types';
import { loadMeshes } from './mesh-loader';
import { generateColorSpaceTexture } from './texture-generator';
import {
  createTransparentCubeMaterial,
  createRegionMaterials,
} from './shaders';
import { COLOR_SPACE_SIZE, COLOR_SPACE_CENTER } from './constants';

function useMeshLoader(highlightColor?: ColorSpaceProps['highlightColor']) {
  const [regionMeshes, setRegionMeshes] = useState<LoadedMesh[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadRegionMeshes() {
      const regions = highlightColor?.colorRegions;

      if (!regions?.length) {
        setRegionMeshes([]);
        return;
      }

      setIsLoading(true);

      try {
        const meshes = await loadMeshes(regions);
        setRegionMeshes(meshes);
      } catch (error) {
        console.error('Error loading meshes:', error);
        setRegionMeshes([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRegionMeshes();
  }, [highlightColor]);

  return { regionMeshes, isLoading };
}

interface ColorCubeProps {
  position: [number, number, number];
  material: THREE.ShaderMaterial;
}

function ColorCube({ position, material }: ColorCubeProps) {
  return (
    <mesh position={position} material={material}>
      <boxGeometry args={[COLOR_SPACE_SIZE, COLOR_SPACE_SIZE, COLOR_SPACE_SIZE, 16, 16, 16]} />
    </mesh>
  );
}

interface RegionMeshesProps {
  meshes: LoadedMesh[];
  materials: THREE.ShaderMaterial[];
}

function RegionMeshes({ meshes, materials }: RegionMeshesProps) {
  return (
    <>
      {meshes.map((region, idx) => (
        <mesh key={idx} material={materials[idx]} geometry={region.geometry} />
      ))}
    </>
  );
}

export default function ColorSpace({
  position = [0, 0, 0],
  highlightColor,
}: ColorSpaceProps) {
  const { regionMeshes, isLoading } = useMeshLoader(highlightColor);

  // Texture is independent of region meshes - generate once
  const texture = useMemo(
    () => generateColorSpaceTexture(),
    []
  );

  const cubeMaterial = useMemo(
    () => createTransparentCubeMaterial(texture),
    [texture]
  );

  const regionMaterials = useMemo(
    () => createRegionMaterials(texture, regionMeshes.length),
    [texture, regionMeshes.length]
  );

  const cubePosition: [number, number, number] = [
    COLOR_SPACE_CENTER,
    COLOR_SPACE_CENTER,
    COLOR_SPACE_CENTER,
  ];

  if (isLoading) {
    return (
      <group position={position} scale={1 / 255}>
        <ColorCube position={cubePosition} material={cubeMaterial} />
      </group>
    );
  }

  return (
    <group position={position} scale={1 / 255}>
      <ColorCube position={cubePosition} material={cubeMaterial} />
      <RegionMeshes meshes={regionMeshes} materials={regionMaterials} />
    </group>
  );
}
