import type { FilePreviewProps } from '../types/upload';
import { formatFileSize } from '../utils/validators';
import styles from './FilePreview.module.css';

export function FilePreview({ file, onRemove, isUploading }: FilePreviewProps) {
  const fileType = file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT';

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        {fileType === 'PDF' ? '📄' : '📝'}
      </div>
      <div className={styles.info}>
        <span className={styles.name} title={file.name}>
          {file.name}
        </span>
        <span className={styles.meta}>
          {fileType} — {formatFileSize(file.size)}
        </span>
      </div>
      <button
        className={styles.remove}
        onClick={onRemove}
        disabled={isUploading}
        aria-label={`Remover arquivo ${file.name}`}
        type="button"
      >
        ×
      </button>
    </div>
  );
}
