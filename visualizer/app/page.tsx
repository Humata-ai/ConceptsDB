import ShapeGraph from './components/ShapeGraph';
import { generateAppleShape } from './utils/appleShape';

export default function Home() {
  const appleMesh = generateAppleShape(7.5);

  return (
    <ShapeGraph
      meshData={appleMesh}
      unit="cm"
      showAxes={true}
      showGrid={true}
      showLabels={true}
      meshColor="#ff6b6b"
      meshOpacity={0.9}
    />
  );
}
