export interface ParsedWord {
  text: string;
  index: number;
  isWord: boolean;
  originalIndex: number;
}

export interface EditableSentenceProps {
  defaultText?: string;
  onWordClick: (word: string, wordIndex: number) => void;
  selectedWordIndex: number | null;
  className?: string;
}
