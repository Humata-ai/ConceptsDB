import { useMemo, useState, useEffect } from 'react';
import type { ColorSpaceProps, LoadedMesh } from './types';
import { loadMeshes } from './mesh-loader';
import { generateColorSpaceTexture } from './texture-generator';
import {
  createTransparentCubeMaterial,
  createRegionMaterials,
} from './shaders';

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
      <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
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

  const texture = useMemo(
    () => generateColorSpaceTexture(regionMeshes),
    [regionMeshes]
  );

  const cubeMaterial = useMemo(
    () => createTransparentCubeMaterial(texture),
    [texture]
  );

  const regionMaterials = useMemo(
    () => createRegionMaterials(texture, regionMeshes.length),
    [texture, regionMeshes.length]
  );

  const cubePosition: [number, number, number] = [0.5, 0.5, 0.5];

  if (isLoading) {
    return (
      <group position={position}>
        <ColorCube position={cubePosition} material={cubeMaterial} />
      </group>
    );
  }

  return (
    <group position={position}>
      <ColorCube position={cubePosition} material={cubeMaterial} />
      <RegionMeshes meshes={regionMeshes} materials={regionMaterials} />
    </group>
  );
}
