import { useRef } from 'react';
import { Textarea } from '@mui/joy';

interface SentenceEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onExit: () => void;
}

export function SentenceEditor({ text, onTextChange, onExit }: SentenceEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <Textarea
      slotProps={{
        textarea: {
          ref: textareaRef,
        },
      }}
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={onExit}
      minRows={1}
      maxRows={8}
      autoFocus
      sx={{
        fontSize: '18px',
        lineHeight: 1.6,
        borderRadius: '8px',
      }}
    />
  );
}
