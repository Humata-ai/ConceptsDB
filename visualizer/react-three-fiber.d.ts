import { BufferGeometry, Material } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line: {
        geometry?: BufferGeometry;
        children?: React.ReactNode;
        key?: string;
      };
    }
  }
}

export {};
