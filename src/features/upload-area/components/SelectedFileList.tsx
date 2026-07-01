import type { FileEntry } from '../types/upload';
import { formatFileSize } from '../utils/validators';
import styles from './SelectedFileList.module.css';

interface SelectedFileListProps {
  files: FileEntry[];
  onRemove: (id: string) => void;
  isUploading: boolean;
}

export function SelectedFileList({ files, onRemove, isUploading }: SelectedFileListProps) {
  if (files.length === 0) return null;

  const getFileType = (name: string) =>
    name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT';

  return (
    <div className={styles.list}>
      <p className={styles.heading}>
        Arquivos selecionados ({files.length})
      </p>
      <ul className={styles.items}>
        {files.map((entry) => {
          const fileType = getFileType(entry.file.name);
          const isPending = entry.status === 'pending';
          const isError = entry.status === 'error';

          return (
            <li
              key={entry.id}
              className={`${styles.item} ${isError ? styles.itemError : ''}`}
            >
              <span className={styles.icon} aria-hidden="true">
                {fileType === 'PDF' ? '📄' : '📝'}
              </span>
              <div className={styles.info}>
                <span className={styles.name} title={entry.file.name}>
                  {entry.file.name}
                </span>
                <span className={styles.meta}>
                  {fileType} — {formatFileSize(entry.file.size)}
                  {entry.status === 'completed' && ' — Enviado'}
                </span>
                {isError && entry.error && (
                  <span className={styles.error} role="alert">
                    {entry.error}
                  </span>
                )}
                {entry.status === 'uploading' && (
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {isPending && (
                <button
                  className={styles.remove}
                  onClick={() => onRemove(entry.id)}
                  aria-label={`Remover ${entry.file.name}`}
                  type="button"
                  disabled={isUploading}
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
