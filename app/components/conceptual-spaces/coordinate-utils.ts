import { COLOR_SPACE_MAX } from './constants';

// Convert voxel index to world coordinate (0-255 space)
export function voxelToWorldCoord(voxelIndex: number, textureSize: number): number {
  return (voxelIndex / (textureSize - 1)) * COLOR_SPACE_MAX;
}

// Convert world coordinate (0-255) to normalized texture coordinate (0-1)
export function worldToTextureCoord(worldCoord: number): number {
  return worldCoord / COLOR_SPACE_MAX;
}

// Convert voxel position to world position
export function voxelToWorldPosition(
  x: number,
  y: number,
  z: number,
  textureSize: number
): [number, number, number] {
  return [
    voxelToWorldCoord(x, textureSize),
    voxelToWorldCoord(y, textureSize),
    voxelToWorldCoord(z, textureSize),
  ];
}

// RGB color directly from world coordinate
export function worldCoordToRGB(
  x: number,
  y: number,
  z: number
): [number, number, number] {
  return [x, y, z]; // Direct mapping!
}
