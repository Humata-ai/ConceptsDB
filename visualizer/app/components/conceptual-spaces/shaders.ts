import * as THREE from 'three';

const COLOR_VERTEX_SHADER = `
  varying vec3 vPosition;

  void main() {
    vPosition = position + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const COLOR_FRAGMENT_SHADER = `
  uniform highp sampler3D colorTexture;
  varying vec3 vPosition;

  void main() {
    gl_FragColor = texture(colorTexture, vPosition);
  }
`;

const REGION_VERTEX_SHADER = `
  varying vec3 vPosition;

  void main() {
    // Vertex positions are already in 0-1 RGB space
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const REGION_FRAGMENT_SHADER = `
  uniform highp sampler3D colorTexture;
  varying vec3 vPosition;

  void main() {
    // Sample texture directly at vertex position (already in 0-1 space)
    gl_FragColor = texture(colorTexture, vPosition);
  }
`;

export function createTransparentCubeMaterial(
  texture: THREE.Data3DTexture
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorTexture: { value: texture },
    },
    vertexShader: COLOR_VERTEX_SHADER,
    fragmentShader: COLOR_FRAGMENT_SHADER,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });
}

export function createRegionMaterial(
  texture: THREE.Data3DTexture
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      colorTexture: { value: texture },
    },
    vertexShader: REGION_VERTEX_SHADER,
    fragmentShader: REGION_FRAGMENT_SHADER,
    side: THREE.DoubleSide,
    transparent: false,
  });
}

export function createRegionMaterials(
  texture: THREE.Data3DTexture,
  count: number
): THREE.ShaderMaterial[] {
  return Array.from({ length: count }, () => createRegionMaterial(texture));
}
