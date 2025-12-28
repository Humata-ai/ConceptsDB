'use client';

import { useState } from 'react';
import ConceptualSpaceDefinition from './components/conceptual-space-definition';
import EditableSentence from './components/editable-sentence';

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string>('apple');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(1); // "apple" is index 1 in default text

  const handleWordClick = (word: string, wordIndex: number) => {
    const normalizedWord = word.toLowerCase().trim();
    setSelectedWord(normalizedWord);
    setSelectedWordIndex(wordIndex);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ConceptualSpaceDefinition word={selectedWord} />
      <EditableSentence
        defaultText="The apple fell from the tree"
        onWordClick={handleWordClick}
        selectedWordIndex={selectedWordIndex}
      />
    </div>
  );
}
