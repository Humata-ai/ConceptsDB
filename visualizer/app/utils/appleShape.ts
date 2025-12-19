import * as THREE from 'three';

export interface MeshData {
  vertices: Float32Array;
  indices: Uint16Array;
  normals?: Float32Array;
}

/**
 * Generate an apple-shaped mesh using parametric equations
 * @param diameter - The diameter of the apple in centimeters (default: 7.5)
 * @param segments - Number of segments around the circumference (default: 32)
 * @param rings - Number of rings from top to bottom (default: 24)
 * @returns MeshData with vertices, indices, and computed normals
 */
export function generateAppleShape(
  diameter: number = 7.5,
  segments: number = 32,
  rings: number = 24
): MeshData {
  const radius = diameter / 2;
  const vertices: number[] = [];
  const indices: number[] = [];

  // Helper function to calculate the radial distance at a given polar angle v
  const getRadius = (v: number): number => {
    // Base radius function with variation
    let r = radius * (0.9 + 0.3 * Math.sin(v) - 0.2 * Math.cos(2 * v));

    // Top indent (stem area) - make it narrower at the top
    if (v < Math.PI / 6) {
      const factor = 0.7 + 0.3 * (v / (Math.PI / 6));
      r *= factor;
    }

    // Bottom indent - slightly narrower at bottom
    if (v > (5 * Math.PI) / 6) {
      r *= 0.95;
    }

    return r;
  };

  // Generate vertices using spherical coordinates
  for (let ring = 0; ring <= rings; ring++) {
    const v = (ring / rings) * Math.PI; // Polar angle from 0 to π
    const r = getRadius(v);

    for (let seg = 0; seg <= segments; seg++) {
      const u = (seg / segments) * 2 * Math.PI; // Azimuthal angle from 0 to 2π

      // Spherical to Cartesian coordinates
      // Note: Y is up axis in Three.js
      const x = r * Math.sin(v) * Math.cos(u);
      const y = r * Math.cos(v);
      const z = r * Math.sin(v) * Math.sin(u);

      vertices.push(x, y, z);
    }
  }

  // Generate indices for triangles (two triangles per quad)
  for (let ring = 0; ring < rings; ring++) {
    for (let seg = 0; seg < segments; seg++) {
      const a = ring * (segments + 1) + seg;
      const b = a + segments + 1;
      const c = a + 1;
      const d = b + 1;

      // First triangle
      indices.push(a, b, c);
      // Second triangle
      indices.push(c, b, d);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
  };
}

/**
 * Create a line geometry between two points
 * @param start - Starting point [x, y, z]
 * @param end - Ending point [x, y, z]
 * @returns THREE.BufferGeometry for the line
 */
export function createLineGeometry(
  start: [number, number, number],
  end: [number, number, number]
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([...start, ...end]);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}
