import * as THREE from 'three';

const COLOR_VERTEX_SHADER = `
  varying vec3 vPosition;

  void main() {
    // BoxGeometry creates vertices in [-127.5, 127.5] range (centered)
    // Convert to [0, 1] for texture sampling: [-127.5, 127.5] → [-0.5, 0.5] → [0, 1]
    vPosition = position / 255.0 + 0.5;
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
    // Position is in [0, 255] space from OBJ
    // Normalize to [0, 1] for texture sampling
    vPosition = position / 255.0;

    // Position is already in [0, 255] space, no centering needed
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const REGION_FRAGMENT_SHADER = `
  uniform highp sampler3D colorTexture;
  varying vec3 vPosition;

  void main() {
    // Sample texture and force alpha to 1.0 (fully opaque)
    vec4 texColor = texture(colorTexture, vPosition);
    gl_FragColor = vec4(texColor.rgb, 1.0);
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
