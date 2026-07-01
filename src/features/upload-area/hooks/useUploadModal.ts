import { useState, useCallback, useRef } from 'react';
import type { FileEntry } from '../types/upload';
import { useFileValidation } from './useFileValidation';
import { ApiUploadService } from '../services/apiUploadService';

export function useUploadModal(sessionId: number | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const uploadServiceRef = useRef(new ApiUploadService());
  const { validateFile } = useFileValidation();

  const open = useCallback(() => {
    setIsOpen(true);
    setFiles([]);
    setGlobalError(null);
    setUploadSuccess(false);
  }, []);

  const close = useCallback(() => {
    if (!isUploading) {
      setIsOpen(false);
      setFiles([]);
      setGlobalError(null);
      setUploadSuccess(false);
    }
  }, [isUploading]);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      setGlobalError(null);
      const entries: FileEntry[] = [];

      for (const file of newFiles) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setGlobalError(validation.error ?? 'Arquivo inválido.');
          continue;
        }

        entries.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          progress: 0,
          status: 'pending',
        });
      }

      if (entries.length === 0) return;

      setFiles((prev) => {
        const existingIds = new Set(prev.map((f) => f.id));
        const unique = entries.filter((f) => !existingIds.has(f.id));
        if (unique.length === 0) {
          setGlobalError('Arquivo já adicionado.');
          return prev;
        }
        if (unique.length < entries.length) {
          setGlobalError('Alguns arquivos já estavam na lista e foram ignorados.');
        }
        return [...prev, ...unique];
      });
    },
    [validateFile],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  async function startUpload() {
    if (sessionId === null || files.length === 0) return;

    setIsUploading(true);
    setGlobalError(null);

    const pending = files.filter((f) => f.status === 'pending');

    for (const entry of pending) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === entry.id ? { ...f, status: 'uploading' as const, progress: 0 } : f,
        ),
      );

      try {
        await uploadServiceRef.current.upload(entry.file, sessionId, (percent) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id ? { ...f, progress: percent } : f,
            ),
          );
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id ? { ...f, status: 'completed' as const, progress: 100 } : f,
          ),
        );
      } catch (err) {
        const uploadError = err as { detail?: string; title?: string };
        setFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error:
                    uploadError.detail ??
                    uploadError.title ??
                    'Falha no upload.',
                }
              : f,
          ),
        );
      }
    }

    setIsUploading(false);

    setFiles([]);
    setGlobalError(null);
    setUploadSuccess(false);
    setIsOpen(false);
  }

  return {
    isOpen,
    files,
    isUploading,
    globalError,
    uploadSuccess,
    open,
    close,
    addFiles,
    removeFile,
    startUpload,
  };
}
