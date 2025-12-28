import styles from '../editable-sentence.module.css';

interface SentencePlaceholderProps {
  onEnterEditMode: () => void;
}

export function SentencePlaceholder({ onEnterEditMode }: SentencePlaceholderProps) {
  return (
    <div className={styles.placeholder} onClick={onEnterEditMode}>
      Click to enter a sentence...
    </div>
  );
}
