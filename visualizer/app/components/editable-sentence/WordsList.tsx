import { ParsedWord } from './types';
import styles from '../editable-sentence.module.css';

interface WordsListProps {
  words: ParsedWord[];
  selectedWordIndex: number | null;
  onWordClick: (word: ParsedWord) => void;
}

export function WordsList({ words, selectedWordIndex, onWordClick }: WordsListProps) {
  return (
    <div className={styles.wordsContainer}>
      {words.map((word) => {
        if (!word.isWord) {
          return <span key={word.index}>{word.text}</span>;
        }

        const isSelected = selectedWordIndex === word.index;

        return (
          <span
            key={word.index}
            onClick={() => onWordClick(word)}
            className={`${styles.clickableWord} ${isSelected ? styles.selected : ''}`}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
