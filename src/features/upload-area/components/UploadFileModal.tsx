import { useEffect, useRef, useCallback } from 'react';
import type { FileEntry } from '../types/upload';
import { FileDropZone } from './FileDropZone';
import { SelectedFileList } from './SelectedFileList';
import { ProgressBar } from './ProgressBar';
import styles from './UploadFileModal.module.css';

interface UploadFileModalProps {
  isOpen: boolean;
  files: FileEntry[];
  isUploading: boolean;
  globalError: string | null;
  uploadSuccess: boolean;
  onClose: () => void;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onUpload: () => void;
}

export function UploadFileModal({
  isOpen,
  files,
  isUploading,
  globalError,
  uploadSuccess,
  onClose,
  onAddFiles,
  onRemoveFile,
  onUpload,
}: UploadFileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUploading) {
        onClose();
      }
    },
    [isUploading, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => modalRef.current?.focus(), 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const pendingFiles = files.filter((f) => f.status === 'pending');
  const canUpload = pendingFiles.length > 0 && !isUploading;
  const overallPercent =
    files.length > 0
      ? Math.round(files.reduce((sum, f) => sum + f.progress, 0) / files.length)
      : 0;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Anexar arquivos"
    >
      <div ref={modalRef} className={styles.modal} tabIndex={-1}>
        <div className={styles.header}>
          <h2 className={styles.title}>Anexar arquivos</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isUploading}
            aria-label="Fechar modal"
            type="button"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <FileDropZone onFilesSelected={onAddFiles} disabled={isUploading} />

          {globalError && (
            <p className={styles.globalError} role="alert">
              {globalError}
            </p>
          )}

          <SelectedFileList
            files={files}
            onRemove={onRemoveFile}
            isUploading={isUploading}
          />

          {isUploading && (
            <div className={styles.uploadProgress}>
              <ProgressBar percent={overallPercent} />
              <p className={styles.uploadingText}>
                Enviando arquivos... (
                {files.filter((f) => f.status === 'completed').length}/{files.length}
                )
              </p>
            </div>
          )}

          {uploadSuccess && (
            <p className={styles.successText} role="alert">
              Arquivos enviados com sucesso!
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isUploading}
            type="button"
          >
            Cancelar
          </button>
          <button
            className={styles.uploadButton}
            onClick={onUpload}
            disabled={!canUpload}
            type="button"
          >
            {isUploading
              ? 'Enviando...'
              : `Enviar${pendingFiles.length > 0 ? ` (${pendingFiles.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
