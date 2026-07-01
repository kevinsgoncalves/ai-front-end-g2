import type { Attachment } from '../types';
import AttachmentCard from './AttachmentCard';
import styles from './AttachmentList.module.css';

interface AttachmentListProps {
  attachments: Attachment[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function AttachmentList({
  attachments,
  isLoading,
  error,
  onRefresh,
}: AttachmentListProps) {
  if (isLoading && attachments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeleton__line} />
          <div className={styles.skeleton__line} />
        </div>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span>{error}</span>

          <button
            type="button"
            className={styles.error__retry}
            onClick={onRefresh}
            aria-label="Tentar novamente"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.heading}>
        Anexos ({attachments.length})
      </span>

      <div
        className={styles.list}
        role="list"
        aria-label="Arquivos anexados"
      >
        {attachments.map((attachment) => (
          <AttachmentCard
            key={attachment.id}
            attachment={attachment}
          />
        ))}
      </div>
    </div>
  );
}

export default AttachmentList;