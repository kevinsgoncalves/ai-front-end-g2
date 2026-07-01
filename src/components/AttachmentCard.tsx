import { useCallback } from 'react';
import type { Attachment, AttachmentStatus } from '../types';
import { getDownloadUrl } from '../services/attachmentService';
import styles from './AttachmentCard.module.css';

interface AttachmentCardProps {
  attachment: Attachment;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}

function statusLabel(status?: AttachmentStatus): string {
  switch (status) {
    case 'PROCESSING':
      return 'Processando';
    case 'INDEXED':
      return 'Pronto para consulta';
    case 'FAILED':
      return 'Falha no processamento';
    default:
      return 'Anexo';
  }
}

function statusClass(status?: AttachmentStatus): string {
  switch (status) {
    case 'PROCESSING':
      return styles['card__status--processing'];
    case 'INDEXED':
      return styles['card__status--indexed'];
    case 'FAILED':
      return styles['card__status--failed'];
    default:
      return '';
  }
}

function AttachmentCard({ attachment }: AttachmentCardProps) {
  const handleOpen = useCallback(() => {
    const url = getDownloadUrl(attachment.id);
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (win === null) {
        window.location.href = url;
      }
    } catch {
      window.location.href = getDownloadUrl(attachment.id);
    }
  }, [attachment.id]);

  const icon = attachment.type === 'PDF' ? '📄' : '📃';
  const label = `Baixar ${attachment.filename}`;
  const status =
    attachment.status === 'INDEXED'
      ? styles['card--indexed']
      : attachment.status === 'FAILED'
        ? styles['card--failed']
        : '';

  return (
    <div
      className={`${styles.card} ${status}`.trim()}
      role="listitem"
    >
      <span className={styles.card__icon} aria-hidden="true">
        {icon}
      </span>

      <div className={styles.card__info}>
        <span className={styles.card__name} title={attachment.filename}>
          {attachment.filename}
        </span>
        <span className={styles.card__meta}>
          {formatFileSize(attachment.size)}
          {' · '}
          <span
            className={`${styles.card__status} ${statusClass(attachment.status)}`.trim()}
          >
            {statusLabel(attachment.status)}
          </span>
        </span>
      </div>

      <button
        type="button"
        className={styles.card__action}
        aria-label={label}
        title={label}
        onClick={handleOpen}
      >
        ↓
      </button>
    </div>
  );
}

export default AttachmentCard;
