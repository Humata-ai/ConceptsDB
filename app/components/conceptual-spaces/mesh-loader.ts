import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { calculateBoundingBox, type MeshData } from '../../utils/pointInMesh';
import type { LoadedMesh, ColorRegion } from './types';
import {
  extractTrianglesFromObject,
  extractFirstMeshGeometry,
} from './triangle-extractor';

function loadSingleMesh(
  loader: OBJLoader,
  region: ColorRegion
): Promise<LoadedMesh> {
  return new Promise((resolve, reject) => {
    loader.load(
      region.meshPath,
      (object) => {
        const triangles = extractTrianglesFromObject(object);
        const meshData: MeshData = { triangles };
        const bbox = calculateBoundingBox(meshData);

        const meshGeometry = extractFirstMeshGeometry(object);

        if (!meshGeometry) {
          reject(new Error(`No mesh geometry found in ${region.meshPath}`));
          return;
        }

        resolve({
          meshPath: region.meshPath,
          meshData,
          bbox,
          geometry: meshGeometry,
        });
      },
      undefined,
      (error) => {
        console.error(`Failed to load mesh ${region.meshPath}:`, error);
        reject(error);
      }
    );
  });
}

export async function loadMeshes(regions: ColorRegion[]): Promise<LoadedMesh[]> {
  const loader = new OBJLoader();
  const meshPromises = regions.map((region) => loadSingleMesh(loader, region));
  return Promise.all(meshPromises);
}
