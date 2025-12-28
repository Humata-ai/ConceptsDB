import { ParsedWord } from './types';

export function parseTextIntoWords(text: string): ParsedWord[] {
  const words: ParsedWord[] = [];
  let wordIndex = 0;

  const wordRegex = /[\w']+|[^\w']+/g;
  const matches = text.matchAll(wordRegex);

  for (const match of matches) {
    const segment = match[0];
    const isWord = /[\w']/.test(segment);

    words.push({
      text: segment,
      index: isWord ? wordIndex : -1,
      isWord: isWord,
      originalIndex: match.index || 0,
    });

    if (isWord) {
      wordIndex++;
    }
  }

  return words;
}

export const CONTAINER_STYLES = {
  position: 'fixed',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 100,
  padding: '16px 24px',
  borderRadius: '12px',
  maxWidth: '80vw',
  minWidth: '400px',
  maxHeight: '200px',
  overflowY: 'auto',
  fontSize: '18px',
  lineHeight: 1.6,
} as const;
