import ConceptualSpace from './components/ConceptualSpace';

export default function Home() {
  return (
    <ConceptualSpace
      xRange={[-10, 10]}
      yRange={[-10, 10]}
      zRange={[-10, 10]}
    />
  );
}
