'use client';

import { createLineGeometry } from '../../utils/appleShape';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}

export default function ConnectionLine({
  start,
  end,
  color = '#666666',
  opacity = 0.6,
}: ConnectionLineProps) {
  const geometry = createLineGeometry(start, end);

  return (
    // @ts-expect-error - React Three Fiber JSX types
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}
