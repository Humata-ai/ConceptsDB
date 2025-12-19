'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea, IconButton, Dropdown, Menu, MenuButton, MenuItem, Sheet } from '@mui/joy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse words on mount
  useEffect(() => {
    setWords(parseTextIntoWords(text));
  }, []);

  const enterEditMode = () => {
    setIsEditing(true);
  };

  const exitEditMode = () => {
    setWords(parseTextIntoWords(text));
    setIsEditing(false);
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
      <Sheet
        className={className}
        variant="outlined"
        sx={{
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
        }}
      >
        <div className={styles.placeholder} onClick={enterEditMode}>
          Click to enter a sentence...
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      className={className}
      variant="outlined"
      sx={{
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
      }}
    >
      {isEditing ? (
        <Textarea
          slotProps={{
            textarea: {
              ref: textareaRef,
            },
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          minRows={3}
          maxRows={8}
          autoFocus
          sx={{
            fontSize: '18px',
            lineHeight: 1.6,
            borderRadius: '8px',
          }}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: {
                    size: 'sm',
                    variant: 'plain',
                    color: 'neutral',
                  },
                }}
              >
                <MoreVertIcon />
              </MenuButton>
              {/* @ts-expect-error Joy UI Menu has complex type definitions in beta */}
              <Menu placement="top-end">
                {/* @ts-expect-error Joy UI MenuItem has complex type definitions in beta */}
                <MenuItem onClick={enterEditMode}>
                  <EditIcon sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
              </Menu>
            </Dropdown>
          </div>

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
    </Sheet>
  );
}
