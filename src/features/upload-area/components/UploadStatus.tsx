import type { UploadStatusMessageProps } from '../types/upload';
import styles from './UploadStatus.module.css';

export function UploadStatus({ type, message, onDismiss }: UploadStatusMessageProps) {
  if (type === null || message === null) {
    return null;
  }

  const className =
    type === 'success' ? styles.success : styles.error;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.icon}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Fechar mensagem"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}
