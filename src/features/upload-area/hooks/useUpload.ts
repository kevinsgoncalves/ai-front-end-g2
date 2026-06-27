import { useState, useCallback, useRef } from 'react';
import type { UploadStatus, UploadError, UseUploadReturn } from '../types/upload';
import type { Attachment } from '../../../types/attachment';
import type { IUploadService } from '../services/uploadService';
import { MockUploadService } from '../services/mockUploadService';
import { useFileValidation } from './useFileValidation';
import { useDragAndDrop } from './useDragAndDrop';
import { FEEDBACK_DURATION } from '../constants/upload';

export function useUpload(
  sessionId: number | null,
  uploadService: IUploadService = new MockUploadService()
): UseUploadReturn {
  const [internalStatus, setInternalStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentResult, setAttachmentResult] = useState<Attachment | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { validateFile } = useFileValidation();

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearFeedbackTimeout();
    setInternalStatus('idle');
    setProgress(0);
    setError(null);
    setSelectedFile(null);
    setAttachmentResult(null);
  }, [clearFeedbackTimeout]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      clearFeedbackTimeout();
      setSelectedFile(file);
      setAttachmentResult(null);

      const validation = validateFile(file);
      if (!validation.valid) {
        setInternalStatus('error');
        setError({
          status: 400,
          title: 'Arquivo inválido',
          detail: validation.error!,
        });
        feedbackTimeoutRef.current = setTimeout(reset, FEEDBACK_DURATION);
        return;
      }

      if (sessionId === null) {
        setInternalStatus('error');
        setError({
          status: 400,
          title: 'Sessão necessária',
          detail: 'Selecione ou crie uma sessão antes de enviar arquivos.',
        });
        feedbackTimeoutRef.current = setTimeout(reset, FEEDBACK_DURATION);
        return;
      }

      setInternalStatus('uploading');
      setProgress(0);
      setError(null);

      try {
        const attachment = await uploadService.upload(file, sessionId, (percent) => {
          setProgress(percent);
        });
        setAttachmentResult(attachment);
        setInternalStatus('completed');
        setProgress(100);
        feedbackTimeoutRef.current = setTimeout(reset, FEEDBACK_DURATION);
      } catch (err) {
        const uploadError = err as UploadError;
        setError({
          status: uploadError.status ?? 500,
          title: uploadError.title ?? 'Erro no upload',
          detail: uploadError.detail ?? 'Falha ao enviar arquivo. Tente novamente.',
        });
        setInternalStatus('error');
        feedbackTimeoutRef.current = setTimeout(reset, FEEDBACK_DURATION);
      }
    },
    [sessionId, validateFile, uploadService, clearFeedbackTimeout, reset]
  );

  const { isDragging, dragHandlers } = useDragAndDrop(handleFileSelect);

  const status: UploadStatus =
    isDragging && internalStatus === 'idle' ? 'dragging' : internalStatus;

  return {
    status,
    progress,
    error,
    selectedFile,
    attachmentResult,
    isDragging,
    dragHandlers,
    handleFileSelect,
    handleRemove: reset,
    handleDismissError: reset,
  };
}
