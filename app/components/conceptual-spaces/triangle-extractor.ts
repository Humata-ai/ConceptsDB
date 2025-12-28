import * as THREE from 'three';
import type { Triangle } from '../../utils/pointInMesh';

function extractIndexedTriangles(
  positionAttribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  indices: THREE.TypedArray
): Triangle[] {
  const triangles: Triangle[] = [];

  for (let i = 0; i < indices.length; i += 3) {
    triangles.push({
      v0: {
        x: positionAttribute.getX(indices[i]),
        y: positionAttribute.getY(indices[i]),
        z: positionAttribute.getZ(indices[i]),
      },
      v1: {
        x: positionAttribute.getX(indices[i + 1]),
        y: positionAttribute.getY(indices[i + 1]),
        z: positionAttribute.getZ(indices[i + 1]),
      },
      v2: {
        x: positionAttribute.getX(indices[i + 2]),
        y: positionAttribute.getY(indices[i + 2]),
        z: positionAttribute.getZ(indices[i + 2]),
      },
    });
  }

  return triangles;
}

function extractNonIndexedTriangles(
  positionAttribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute
): Triangle[] {
  const triangles: Triangle[] = [];

  for (let i = 0; i < positionAttribute.count; i += 3) {
    triangles.push({
      v0: {
        x: positionAttribute.getX(i),
        y: positionAttribute.getY(i),
        z: positionAttribute.getZ(i),
      },
      v1: {
        x: positionAttribute.getX(i + 1),
        y: positionAttribute.getY(i + 1),
        z: positionAttribute.getZ(i + 1),
      },
      v2: {
        x: positionAttribute.getX(i + 2),
        y: positionAttribute.getY(i + 2),
        z: positionAttribute.getZ(i + 2),
      },
    });
  }

  return triangles;
}

export function extractTrianglesFromGeometry(geometry: THREE.BufferGeometry): Triangle[] {
  const positionAttribute = geometry.getAttribute('position');

  if (!geometry.index) {
    return extractNonIndexedTriangles(positionAttribute);
  }

  return extractIndexedTriangles(positionAttribute, geometry.index.array);
}

export function extractTrianglesFromObject(object: THREE.Object3D): Triangle[] {
  const triangles: Triangle[] = [];

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    if (!(child.geometry instanceof THREE.BufferGeometry)) {
      return;
    }

    triangles.push(...extractTrianglesFromGeometry(child.geometry));
  });

  return triangles;
}

export function extractFirstMeshGeometry(object: THREE.Object3D): THREE.BufferGeometry | null {
  let meshGeometry: THREE.BufferGeometry | null = null;

  object.traverse((child) => {
    if (meshGeometry) {
      return;
    }

    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    meshGeometry = child.geometry;
  });

  return meshGeometry;
}
