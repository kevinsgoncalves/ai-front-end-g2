import { useRef, useState } from 'react';
import styles from './FileDropZone.module.css';
import { ACCEPT_INPUT } from '../constants/upload';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

export function FileDropZone({ onFilesSelected, disabled }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      onFilesSelected(Array.from(fileList));
    }
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const containerClass = [
    styles.container,
    isDragging ? styles.dragging : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClass}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Clique ou arraste arquivos para adicionar"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_INPUT}
        multiple
        onChange={handleInputChange}
        className={styles.input}
        aria-hidden="true"
        tabIndex={-1}
        disabled={disabled}
      />

      <span className={styles.icon} aria-hidden="true">📎</span>
      <p className={styles.text}>
        Arraste arquivos .txt ou .pdf para cá
        <br />
        ou clique para selecionar
      </p>
      <p className={styles.limit}>Limite máximo: 10 MB por arquivo</p>

      {isDragging && (
        <div className={styles.overlay}>
          <span className={styles.overlayIcon} aria-hidden="true">📁</span>
          <p className={styles.overlayText}>Solte os arquivos aqui</p>
        </div>
      )}
    </div>
  );
}
