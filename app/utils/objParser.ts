import { MeshData } from './appleShape';

/**
 * Parse an OBJ file and convert it to MeshData format
 * @param objText - The raw OBJ file content as a string
 * @returns MeshData with vertices, indices, and normals
 */
export function parseOBJ(objText: string): MeshData {
  const vertices: number[] = [];
  const normals: number[] = [];
  const faces: number[][] = [];

  // Temporary storage for parsed v and vn lines
  const vertexPositions: number[][] = [];
  const vertexNormals: number[][] = [];

  const lines = objText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split(/\s+/);
    const type = parts[0];

    if (type === 'v') {
      // Vertex position: v x y z
      vertexPositions.push([
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
      ]);
    } else if (type === 'vn') {
      // Vertex normal: vn x y z
      vertexNormals.push([
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
      ]);
    } else if (type === 'f') {
      // Face: f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 ...
      const faceVertices: number[] = [];

      for (let i = 1; i < parts.length; i++) {
        const vertexData = parts[i].split('/');
        // OBJ indices are 1-based, convert to 0-based
        const vertexIndex = parseInt(vertexData[0]) - 1;
        faceVertices.push(vertexIndex);
      }

      faces.push(faceVertices);
    }
  }

  // Build unique vertex list and index buffer
  // OBJ files can have different vertex positions share the same index
  // but we need to expand them for BufferGeometry
  const vertexMap = new Map<string, number>();
  const finalVertices: number[] = [];
  const finalNormals: number[] = [];
  const indices: number[] = [];

  for (const face of faces) {
    // Triangulate face if it has more than 3 vertices
    // Using simple fan triangulation from first vertex
    for (let i = 1; i < face.length - 1; i++) {
      const indices3 = [face[0], face[i], face[i + 1]];

      for (const idx of indices3) {
        const key = `${idx}`;

        if (!vertexMap.has(key)) {
          const newIndex = finalVertices.length / 3;
          vertexMap.set(key, newIndex);

          // Add vertex position
          finalVertices.push(...vertexPositions[idx]);

          // Add normal if available
          if (vertexNormals[idx]) {
            finalNormals.push(...vertexNormals[idx]);
          }
        }

        indices.push(vertexMap.get(key)!);
      }
    }
  }

  return {
    vertices: new Float32Array(finalVertices),
    indices: new Uint16Array(indices),
    normals: finalNormals.length > 0 ? new Float32Array(finalNormals) : undefined,
  };
}

/**
 * Load an OBJ file from a URL and parse it
 * @param url - URL to the OBJ file
 * @returns Promise<MeshData>
 */
export async function loadOBJ(url: string): Promise<MeshData> {
  const response = await fetch(url);
  const objText = await response.text();
  return parseOBJ(objText);
}

/**
 * Scale mesh data by a uniform factor
 * @param meshData - The mesh data to scale
 * @param scale - Scale factor (e.g., 10 to convert from 0.1 units to 1 unit)
 * @returns New MeshData with scaled vertices
 */
export function scaleMeshData(meshData: MeshData, scale: number): MeshData {
  const scaledVertices = new Float32Array(meshData.vertices.length);

  for (let i = 0; i < meshData.vertices.length; i++) {
    scaledVertices[i] = meshData.vertices[i] * scale;
  }

  return {
    vertices: scaledVertices,
    indices: meshData.indices,
    normals: meshData.normals,
  };
}

/**
 * Calculate the bounding box of mesh data
 * @param meshData - The mesh data
 * @returns Object with min and max coordinates
 */
export function calculateBoundingBox(meshData: MeshData): {
  min: [number, number, number];
  max: [number, number, number];
  size: [number, number, number];
} {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < meshData.vertices.length; i += 3) {
    const x = meshData.vertices[i];
    const y = meshData.vertices[i + 1];
    const z = meshData.vertices[i + 2];

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    size: [maxX - minX, maxY - minY, maxZ - minZ],
  };
}
