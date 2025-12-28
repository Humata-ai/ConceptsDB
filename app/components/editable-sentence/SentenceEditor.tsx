import { useRef } from 'react';
import { Textarea, Button } from '@mui/joy';
import CheckIcon from '@mui/icons-material/Check';

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
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
      <Textarea
        slotProps={{
          textarea: {
            ref: textareaRef,
          },
        }}
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        minRows={1}
        maxRows={8}
        autoFocus
        sx={{
          fontSize: '18px',
          lineHeight: 1.6,
          borderRadius: '8px',
          flex: 1,
        }}
      />
      <Button
        onClick={onExit}
        size="sm"
        variant="soft"
        color="neutral"
        sx={{ alignSelf: 'stretch' }}
      >
        <CheckIcon />
      </Button>
    </div>
  );
}
