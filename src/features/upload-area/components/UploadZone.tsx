import { useRef } from 'react';
import type { UploadZoneProps } from '../types/upload';
import { ProgressBar } from './ProgressBar';
import { FilePreview } from './FilePreview';
import { UploadStatus } from './UploadStatus';
import { ACCEPT_INPUT } from '../constants/upload';
import styles from './UploadZone.module.css';

export function UploadZone({
  status,
  error,
  selectedFile,
  progress,
  onFileSelect,
  onRemove,
  isDisabled,
  dragHandlers,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isDragging = status === 'dragging';
  const isUploading = status === 'uploading';
  const showProgress = isUploading || status === 'completed';

  const handleContainerClick = () => {
    if (!isDisabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && !isUploading) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
    e.target.value = '';
  };

  const containerClass = [
    styles.container,
    isDragging ? styles.dragging : '',
    isDisabled ? styles.disabled : '',
    isUploading ? styles.uploading : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section aria-label="Área de upload de arquivos">
      <div
        className={containerClass}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || isUploading}
        aria-label={
          isDisabled
            ? 'Upload desabilitado. Selecione uma sessão primeiro.'
            : 'Clique ou arraste arquivos para fazer upload'
        }
        {...dragHandlers}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_INPUT}
          onChange={handleInputChange}
          className={styles.input}
          aria-hidden="true"
          tabIndex={-1}
          disabled={isDisabled || isUploading}
        />

        {selectedFile && (
          <FilePreview
            file={selectedFile}
            onRemove={onRemove}
            isUploading={isUploading}
          />
        )}

        {!selectedFile && !isUploading && (
          <div className={styles.placeholder}>
            <span className={styles.icon}>☁️</span>
            <p className={styles.text}>
              Arraste arquivos .txt ou .pdf
              <br />
              ou clique para selecionar
            </p>
            <p className={styles.limit}>Limite máximo: 10 MB</p>
          </div>
        )}

        {isDragging && (
          <div className={styles.dragOverlay}>
            <span className={styles.dragIcon}>📁</span>
            <p className={styles.dragText}>Solte o arquivo aqui</p>
          </div>
        )}
      </div>

      {showProgress && <ProgressBar percent={progress} />}

      {error && (
        <UploadStatus
          type="error"
          message={error}
          onDismiss={onRemove}
        />
      )}

      {status === 'completed' && !error && (
        <UploadStatus
          type="success"
          message="Arquivo enviado com sucesso!"
          onDismiss={onRemove}
        />
      )}
    </section>
  );
}
