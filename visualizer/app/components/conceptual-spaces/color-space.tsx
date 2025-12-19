import * as THREE from 'three';
import { useMemo, useState, useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  isPointInMesh,
  calculateBoundingBox,
  type MeshData,
  type BoundingBox,
  type Triangle,
} from '../../utils/pointInMesh';

interface ColorSpaceProps {
  position?: [number, number, number];
  highlightColor?: {
    colorRegions?: Array<{
      meshPath: string;
    }>;
  };
}

interface LoadedMesh {
  meshPath: string;
  meshData: MeshData;
  bbox: BoundingBox;
  geometry: THREE.BufferGeometry;
}

export default function ColorSpace({
  position = [0, 0, 0],
  highlightColor,
}: ColorSpaceProps) {
  const [regionMeshes, setRegionMeshes] = useState<LoadedMesh[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load mesh files
  useEffect(() => {
    async function loadMeshes() {
      if (!highlightColor?.colorRegions?.length) {
        setRegionMeshes([]);
        return;
      }

      setIsLoading(true);

      try {
        const loader = new OBJLoader();

        const meshes = await Promise.all(
          highlightColor.colorRegions.map(async (region) => {
            return new Promise<LoadedMesh>((resolve, reject) => {
              loader.load(
                region.meshPath,
                (object) => {
                  // Extract triangles from loaded OBJ
                  const triangles: Triangle[] = [];

                  object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                      const geometry = child.geometry;

                      if (geometry instanceof THREE.BufferGeometry) {
                        const positionAttribute = geometry.getAttribute('position');

                        if (geometry.index) {
                          // Indexed geometry
                          const indices = geometry.index.array;

                          for (let i = 0; i < indices.length; i += 3) {
                            const i0 = indices[i] * 3;
                            const i1 = indices[i + 1] * 3;
                            const i2 = indices[i + 2] * 3;

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
                        } else {
                          // Non-indexed geometry
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
                        }
                      }
                    }
                  });

                  const meshData: MeshData = { triangles };
                  const bbox = calculateBoundingBox(meshData);

                  // Extract first mesh geometry for rendering
                  let meshGeometry: THREE.BufferGeometry | null = null;
                  object.traverse((child) => {
                    if (child instanceof THREE.Mesh && !meshGeometry) {
                      meshGeometry = child.geometry;
                    }
                  });

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
          })
        );

        setRegionMeshes(meshes);
      } catch (error) {
        console.error('Error loading meshes:', error);
        setRegionMeshes([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadMeshes();
  }, [highlightColor]);

  // Generate 3D texture with point-in-mesh detection
  const texture = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * size * 4);

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (z * size * size + y * size + x) * 4;

          // RGB color value
          data[index] = (x / (size - 1)) * 255;
          data[index + 1] = (y / (size - 1)) * 255;
          data[index + 2] = (z / (size - 1)) * 255;

          // Alpha channel - OR logic across all meshes
          if (regionMeshes.length > 0) {
            const voxelPos: [number, number, number] = [
              x / (size - 1),
              y / (size - 1),
              z / (size - 1),
            ];

            // Check if voxel is inside ANY mesh
            const inAnyMesh = regionMeshes.some(mesh =>
              isPointInMesh(voxelPos, mesh.meshData, mesh.bbox)
            );

            // Set alpha: 255 (opaque) inside region, 26 (0.1 opacity) outside
            data[index + 3] = inAnyMesh ? 255 : 26;
          } else {
            // No regions defined: fully opaque
            data[index + 3] = 255;
          }
        }
      }
    }

    const texture3D = new THREE.Data3DTexture(data, size, size, size);
    texture3D.format = THREE.RGBAFormat;
    texture3D.type = THREE.UnsignedByteType;
    texture3D.minFilter = THREE.LinearFilter;
    texture3D.magFilter = THREE.LinearFilter;
    texture3D.wrapS = THREE.ClampToEdgeWrapping;
    texture3D.wrapT = THREE.ClampToEdgeWrapping;
    texture3D.wrapR = THREE.ClampToEdgeWrapping;
    texture3D.needsUpdate = true;

    return texture3D;
  }, [regionMeshes]);

  // Material for full color cube (with transparency)
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: { value: texture },
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          vPosition = position + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform highp sampler3D colorTexture;
        varying vec3 vPosition;

        void main() {
          gl_FragColor = texture(colorTexture, vPosition);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }, [texture]);

  // Create materials for each region mesh
  const regionMaterials = useMemo(() => {
    return regionMeshes.map(() => {
      return new THREE.ShaderMaterial({
        uniforms: {
          colorTexture: { value: texture },
        },
        vertexShader: `
          varying vec3 vPosition;

          void main() {
            // Vertex positions are already in 0-1 RGB space
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform highp sampler3D colorTexture;
          varying vec3 vPosition;

          void main() {
            // Sample texture directly at vertex position (already in 0-1 space)
            gl_FragColor = texture(colorTexture, vPosition);
          }
        `,
        side: THREE.DoubleSide,
        transparent: false,
      });
    });
  }, [texture, regionMeshes]);

  if (isLoading) {
    return (
      <group position={position}>
        {/* Show transparent cube while loading */}
        <mesh position={[0.5, 0.5, 0.5]} material={material}>
          <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      {/* Full RGB Cube (mostly transparent) */}
      <mesh position={[0.5, 0.5, 0.5]} material={material}>
        <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
      </mesh>

      {/* Region meshes (opaque, show gradient) */}
      {regionMeshes.map((region, idx) => (
        <mesh
          key={idx}
          material={regionMaterials[idx]}
          geometry={region.geometry}
        />
      ))}
    </group>
  );
}
