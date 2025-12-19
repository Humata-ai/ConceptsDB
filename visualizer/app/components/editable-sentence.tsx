'use client';

import { useState, useEffect } from 'react';
import { EditableSentenceProps, ParsedWord } from './editable-sentence/types';
import { parseTextIntoWords } from './editable-sentence/utils';
import { SentenceContainer } from './editable-sentence/SentenceContainer';
import { SentencePlaceholder } from './editable-sentence/SentencePlaceholder';
import { SentenceEditor } from './editable-sentence/SentenceEditor';
import { SentenceDisplay } from './editable-sentence/SentenceDisplay';

export default function EditableSentence({
  defaultText = 'The apple fell from the tree',
  onWordClick,
  selectedWordIndex,
  className = '',
}: EditableSentenceProps) {
  const [text, setText] = useState(defaultText);
  const [words, setWords] = useState<ParsedWord[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleWordClick = (word: ParsedWord) => {
    if (isEditing || !word.isWord) {
      return;
    }
    onWordClick(word.text, word.index);
  };

  if (!isEditing && words.length === 0) {
    return (
      <SentenceContainer className={className}>
        <SentencePlaceholder onEnterEditMode={enterEditMode} />
      </SentenceContainer>
    );
  }

  if (isEditing) {
    return (
      <SentenceContainer className={className}>
        <SentenceEditor text={text} onTextChange={setText} onExit={exitEditMode} />
      </SentenceContainer>
    );
  }

  return (
    <SentenceContainer className={className}>
      <SentenceDisplay
        words={words}
        selectedWordIndex={selectedWordIndex}
        onWordClick={handleWordClick}
        onEditClick={enterEditMode}
      />
    </SentenceContainer>
  );
}
