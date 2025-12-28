'use client';

import * as THREE from 'three';

interface BoundingBoxProps {
  size: [number, number, number];
  position?: [number, number, number];
  color?: string;
  opacity?: number;
}

export default function BoundingBox({
  size,
  position = [0, 0, 0],
  color = '#444444',
  opacity = 0.5,
}: BoundingBoxProps) {
  // Create box geometry and extract edges for wireframe
  const boxGeometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);

  return (
    <lineSegments geometry={edgesGeometry} position={position}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}
