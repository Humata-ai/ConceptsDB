import { ParsedWord } from './types';
import { EditMenu } from './EditMenu';
import { WordsList } from './WordsList';

interface SentenceDisplayProps {
  words: ParsedWord[];
  selectedWordIndex: number | null;
  onWordClick: (word: ParsedWord) => void;
  onEditClick: () => void;
}

export function SentenceDisplay({ words, selectedWordIndex, onWordClick, onEditClick }: SentenceDisplayProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <WordsList words={words} selectedWordIndex={selectedWordIndex} onWordClick={onWordClick} />
      <span style={{ flexGrow: 1 }} />
      <EditMenu onEditClick={onEditClick} />
    </div>
  );
}
