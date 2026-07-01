import type { Attachment } from '../../../types/attachment';

export type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'completed' | 'error';

export interface UploadError {
  status: number;
  title: string;
  detail: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: UploadError | null;
  selectedFile: File | null;
  attachmentResult: Attachment | null;
}

export interface DragHandlers {
  onDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
}

export interface UploadZoneProps {
  status: UploadStatus;
  error: string | null;
  selectedFile: File | null;
  progress: number;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  isDisabled: boolean;
  dragHandlers?: DragHandlers;
}

export interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  isUploading: boolean;
}

export interface UploadStatusMessageProps {
  type: 'success' | 'error' | null;
  message: string | null;
  onDismiss?: () => void;
}

export interface ProgressBarProps {
  percent: number;
}

export interface FileEntry {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UseUploadReturn {
  status: UploadStatus;
  progress: number;
  error: UploadError | null;
  selectedFile: File | null;
  attachmentResult: Attachment | null;
  isDragging: boolean;
  dragHandlers: {
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDrop: (e: React.DragEvent<HTMLElement>) => void;
  };
  handleFileSelect: (file: File) => void;
  handleRemove: () => void;
  handleDismissError: () => void;
}
