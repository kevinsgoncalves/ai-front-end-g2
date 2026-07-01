import { useState, useEffect, useCallback, useRef } from 'react';
import type { Attachment } from '../types';
import { getAttachmentsBySessionId } from '../services/attachmentService';

interface UseAttachmentsReturn {
  attachments: Attachment[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAttachments(
  sessionId: number | null,
): UseAttachmentsReturn {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (sid: number) => {
      stopPolling();
      intervalRef.current = setInterval(async () => {
        try {
          const data = await getAttachmentsBySessionId(sid);
          if (!mountedRef.current) return;
          setAttachments(data);
          const stillProcessing = data.some(
            (a) => a.status === 'PROCESSING',
          );
          if (!stillProcessing) {
            stopPolling();
          }
        } catch {
          if (!mountedRef.current) return;
        }
      }, 4000);
    },
    [stopPolling],
  );

  const load = useCallback(
    async (sid: number) => {
      setIsLoading(true);
      setError(null);
      stopPolling();

      try {
        const data = await getAttachmentsBySessionId(sid);
        if (!mountedRef.current) return;
        setAttachments(data);

        const hasProcessing = data.some(
          (a) => a.status === 'PROCESSING',
        );
        if (hasProcessing) {
          startPolling(sid);
        }
      } catch {
        if (mountedRef.current) {
          setError('Erro ao carregar anexos.');
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [stopPolling, startPolling],
  );

  const refresh = useCallback(() => {
    if (sessionId !== null) {
      load(sessionId);
    }
  }, [sessionId, load]);

  useEffect(() => {
    mountedRef.current = true;

    if (sessionId !== null) {
      load(sessionId);
    } else {
      setAttachments([]);
      setError(null);
      setIsLoading(false);
      stopPolling();
    }

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [sessionId, load, stopPolling]);

  return { attachments, isLoading, error, refresh };
}
