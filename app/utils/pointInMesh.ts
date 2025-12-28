// Point-in-mesh utility using ray casting algorithm
// Used to determine if a voxel position is inside a 3D mesh

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Triangle {
  v0: Vector3;
  v1: Vector3;
  v2: Vector3;
}

export interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

export interface MeshData {
  triangles: Triangle[];
}

/**
 * Check if a point is inside an Axis-Aligned Bounding Box (AABB)
 * Fast rejection test before expensive ray-casting
 */
export function isPointInBoundingBox(
  point: [number, number, number],
  bbox: BoundingBox
): boolean {
  const [x, y, z] = point;

  return (
    x >= bbox.min.x && x <= bbox.max.x &&
    y >= bbox.min.y && y <= bbox.max.y &&
    z >= bbox.min.z && z <= bbox.max.z
  );
}

/**
 * Calculate bounding box for a mesh
 */
export function calculateBoundingBox(meshData: MeshData): BoundingBox {
  if (meshData.triangles.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
    };
  }

  const firstVertex = meshData.triangles[0].v0;
  const bbox: BoundingBox = {
    min: { x: firstVertex.x, y: firstVertex.y, z: firstVertex.z },
    max: { x: firstVertex.x, y: firstVertex.y, z: firstVertex.z },
  };

  for (const triangle of meshData.triangles) {
    const vertices = [triangle.v0, triangle.v1, triangle.v2];

    for (const vertex of vertices) {
      bbox.min.x = Math.min(bbox.min.x, vertex.x);
      bbox.min.y = Math.min(bbox.min.y, vertex.y);
      bbox.min.z = Math.min(bbox.min.z, vertex.z);

      bbox.max.x = Math.max(bbox.max.x, vertex.x);
      bbox.max.y = Math.max(bbox.max.y, vertex.y);
      bbox.max.z = Math.max(bbox.max.z, vertex.z);
    }
  }

  return bbox;
}

/**
 * M\u00f6ller\u2013Trumbore ray-triangle intersection algorithm
 * Returns true if ray intersects triangle
 *
 * @param rayOrigin Starting point of the ray
 * @param rayDirection Direction vector of the ray
 * @param triangle Triangle to test intersection with
 */
export function rayIntersectsTriangle(
  rayOrigin: [number, number, number],
  rayDirection: [number, number, number],
  triangle: Triangle
): boolean {
  const EPSILON = 0.0000001;

  const { v0, v1, v2 } = triangle;

  // Edge vectors
  const edge1 = {
    x: v1.x - v0.x,
    y: v1.y - v0.y,
    z: v1.z - v0.z,
  };

  const edge2 = {
    x: v2.x - v0.x,
    y: v2.y - v0.y,
    z: v2.z - v0.z,
  };

  // Begin calculating determinant - also used to calculate U parameter
  const h = {
    x: rayDirection[1] * edge2.z - rayDirection[2] * edge2.y,
    y: rayDirection[2] * edge2.x - rayDirection[0] * edge2.z,
    z: rayDirection[0] * edge2.y - rayDirection[1] * edge2.x,
  };

  // Determinant
  const det = edge1.x * h.x + edge1.y * h.y + edge1.z * h.z;

  // Ray is parallel to triangle plane
  if (det > -EPSILON && det < EPSILON) {
    return false;
  }

  const invDet = 1.0 / det;

  // Distance from v0 to ray origin
  const s = {
    x: rayOrigin[0] - v0.x,
    y: rayOrigin[1] - v0.y,
    z: rayOrigin[2] - v0.z,
  };

  // U parameter
  const u = invDet * (s.x * h.x + s.y * h.y + s.z * h.z);

  if (u < 0.0 || u > 1.0) {
    return false;
  }

  // Prepare to test V parameter
  const q = {
    x: s.y * edge1.z - s.z * edge1.y,
    y: s.z * edge1.x - s.x * edge1.z,
    z: s.x * edge1.y - s.y * edge1.x,
  };

  // V parameter
  const v = invDet * (rayDirection[0] * q.x + rayDirection[1] * q.y + rayDirection[2] * q.z);

  if (v < 0.0 || u + v > 1.0) {
    return false;
  }

  // T parameter - intersection distance along ray
  const t = invDet * (edge2.x * q.x + edge2.y * q.y + edge2.z * q.z);

  // Ray intersection
  if (t > EPSILON) {
    return true;
  }

  return false;
}

/**
 * Determine if a point is inside a mesh using ray casting
 *
 * Algorithm:
 * 1. Cast a ray from the point in +X direction
 * 2. Count intersections with mesh triangles
 * 3. Odd count = inside, even count = outside
 *
 * Optimizations:
 * - AABB pre-check to skip expensive ray casts
 * - Suitable for 64³ voxel grids (~262k checks)
 *
 * @param point Point to test [x, y, z] in 0-255 coordinate space
 * @param meshData Mesh data with triangles
 * @param bbox Optional precomputed bounding box for optimization
 * @returns true if point is inside mesh
 */
export function isPointInMesh(
  point: [number, number, number],
  meshData: MeshData,
  bbox?: BoundingBox
): boolean {
  // AABB pre-check (fast rejection)
  if (bbox && !isPointInBoundingBox(point, bbox)) {
    return false;
  }

  // Ray direction: +X axis
  const rayDirection: [number, number, number] = [1, 0, 0];

  // Count triangle intersections
  let intersectionCount = 0;

  for (const triangle of meshData.triangles) {
    if (rayIntersectsTriangle(point, rayDirection, triangle)) {
      intersectionCount++;
    }
  }

  // Odd number of intersections = inside mesh
  return intersectionCount % 2 === 1;
}
