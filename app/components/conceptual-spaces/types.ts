import type { MeshData, BoundingBox } from '../../utils/pointInMesh';
import type * as THREE from 'three';

export interface ColorSpaceProps {
  position?: [number, number, number];
  highlightColor?: {
    colorRegions?: Array<{
      meshPath: string;
    }>;
  };
}

export interface LoadedMesh {
  meshPath: string;
  meshData: MeshData;
  bbox: BoundingBox;
  geometry: THREE.BufferGeometry;
}

export interface ColorRegion {
  meshPath: string;
}
