import { Sheet } from '@mui/joy';
import { CONTAINER_STYLES } from './utils';

interface SentenceContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function SentenceContainer({ className, children }: SentenceContainerProps) {
  return (
    <Sheet className={className} variant="outlined" sx={CONTAINER_STYLES}>
      {children}
    </Sheet>
  );
}
