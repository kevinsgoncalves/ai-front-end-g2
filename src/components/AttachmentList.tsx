import type { AttachmentDetail } from '../types';
import { getDownloadUrl } from '../services/attachmentService';

interface AttachmentListProps {
  attachments: AttachmentDetail[];
  onRefresh?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const base = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, unitIndex);
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'RECEIVED':
    case 'PROCESSING':
      return 'Processando';
    case 'INDEXED':
      return 'Pronto';
    case 'FAILED':
      return 'Falha no processamento';
    default:
      return status;
  }
}

function AttachmentCard({ attachment, onRefresh }: { attachment: AttachmentDetail; onRefresh?: () => void }) {
  const isProcessing = attachment.documentStatus === 'RECEIVED' || attachment.documentStatus === 'PROCESSING';
  const isFailed = attachment.documentStatus === 'FAILED';
  const isReady = attachment.documentStatus === 'INDEXED';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      backgroundColor: 'var(--bg-tertiary, #f5f5f5)',
      border: '1px solid var(--border, #e0e0e0)',
      borderRadius: '8px',
      fontSize: '0.875rem',
    }}>
      <span style={{ fontSize: '1.25rem' }}>
        {attachment.type === 'PDF' ? '\u{1F4C4}' : '\u{1F4DD}'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary, #1a1a1a)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {attachment.filename}
        </div>
        <div style={{ color: 'var(--text-secondary, #666)', fontSize: '0.75rem' }}>
          {attachment.type} — {formatFileSize(attachment.size)} — {statusLabel(attachment.documentStatus)}
        </div>
        {isFailed && attachment.errorMessage && (
          <div style={{ color: 'var(--danger, #e53935)', fontSize: '0.75rem', marginTop: '2px' }}>
            {attachment.errorMessage}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {isReady && (
          <a
            href={getDownloadUrl(attachment.id)}
            download={attachment.filename}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid var(--border, #e0e0e0)',
              background: 'var(--bg-secondary, #fff)',
              color: 'var(--text-primary, #1a1a1a)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Baixar
          </a>
        )}
        {isFailed && onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid var(--border, #e0e0e0)',
              background: 'var(--bg-secondary, #fff)',
              color: 'var(--accent, #1976d2)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Atualizar
          </button>
        )}
        {isProcessing && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #999)' }}>
            Processando...
          </span>
        )}
      </div>
    </div>
  );
}

function AttachmentList({ attachments, onRefresh }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border, #e0e0e0)',
    }}>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary, #666)' }}>
        Anexos ({attachments.length})
      </div>
      {attachments.map((att) => (
        <AttachmentCard key={att.id} attachment={att} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

export default AttachmentList;
