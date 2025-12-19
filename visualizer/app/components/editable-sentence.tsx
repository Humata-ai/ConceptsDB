'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './editable-sentence.module.css';

interface EditableSentenceProps {
  defaultText?: string;
  onWordClick: (word: string, wordIndex: number) => void;
  selectedWordIndex: number | null;
  className?: string;
}

interface ParsedWord {
  text: string;
  index: number;
  isWord: boolean;
  originalIndex: number;
}

function parseTextIntoWords(text: string): ParsedWord[] {
  const words: ParsedWord[] = [];
  let currentIndex = 0;

  // Regex to match words (letters, numbers, apostrophes) vs non-words
  const wordRegex = /[\w']+|[^\w']+/g;
  const matches = text.matchAll(wordRegex);

  for (const match of matches) {
    const segment = match[0];
    const isWord = /[\w']/.test(segment);

    words.push({
      text: segment,
      index: currentIndex,
      isWord: isWord,
      originalIndex: match.index || 0,
    });

    currentIndex++;
  }

  return words;
}

export default function EditableSentence({
  defaultText = 'The apple fell from the tree',
  onWordClick,
  selectedWordIndex,
  className = '',
}: EditableSentenceProps) {
  const [text, setText] = useState(defaultText);
  const [words, setWords] = useState<ParsedWord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Parse words on mount and when text changes from outside
  useEffect(() => {
    setWords(parseTextIntoWords(text));
  }, []);

  const enterEditMode = () => {
    setIsEditing(true);
    // Focus and select all text after render
    setTimeout(() => {
      if (contentEditableRef.current) {
        contentEditableRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(contentEditableRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  };

  const exitEditMode = () => {
    if (contentEditableRef.current) {
      const newText = contentEditableRef.current.innerText;
      setText(newText);
      setWords(parseTextIntoWords(newText));
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      exitEditMode();
    }
  };

  const handleBlur = () => {
    exitEditMode();
  };

  const handleWordClick = (word: ParsedWord) => {
    if (!isEditing && word.isWord) {
      onWordClick(word.text, word.index);
    }
  };

  // Show placeholder if no words
  if (!isEditing && words.length === 0) {
    return (
      <div className={`${styles.sentenceContainer} ${className}`}>
        <div className={styles.placeholder} onClick={enterEditMode}>
          Click to enter a sentence...
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.sentenceContainer} ${className}`}>
      {isEditing ? (
        <div
          ref={contentEditableRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={styles.editableContent}
        >
          {text}
        </div>
      ) : (
        <>
          <button
            className={styles.editButton}
            onClick={enterEditMode}
            aria-label="Edit sentence"
          >
            ✎
          </button>
          <div className={styles.wordsContainer}>
            {words.map((word) => {
              if (!word.isWord) {
                return <span key={word.index}>{word.text}</span>;
              }

              const isSelected = selectedWordIndex === word.index;

              return (
                <span
                  key={word.index}
                  onClick={() => handleWordClick(word)}
                  className={`${styles.clickableWord} ${
                    isSelected ? styles.selected : ''
                  }`}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
