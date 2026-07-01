import { useState, useEffect, useCallback, useRef } from 'react';
import type { AttachmentDetail } from '../types';
import { getAttachmentsBySession } from '../services/attachmentService';

interface UseSessionAttachmentsReturn {
  attachments: AttachmentDetail[];
  isLoading: boolean;
  refresh: () => void;
}

const POLL_INTERVAL = 3000;

export function useSessionAttachments(sessionId: number | null): UseSessionAttachmentsReturn {
  const [attachments, setAttachments] = useState<AttachmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef(sessionId);

  const hasProcessing = useCallback(
    (list: AttachmentDetail[]) =>
      list.some((a) => a.documentStatus === 'PROCESSING' || a.documentStatus === 'RECEIVED'),
    [],
  );

  const fetchAttachments = useCallback(async () => {
    if (sessionId === null) return;
    try {
      const data = await getAttachmentsBySession(sessionId);
      setAttachments(data);
      return data;
    } catch {
      return null;
    }
  }, [sessionId]);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const data = await fetchAttachments();
      if (data && !hasProcessing(data)) {
        stopPolling();
      }
    }, POLL_INTERVAL);
  }, [fetchAttachments, hasProcessing, stopPolling]);

  useEffect(() => {
    sessionRef.current = sessionId;
    stopPolling();

    if (sessionId === null) {
      setAttachments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchAttachments()
      .then((data) => {
        if (data && hasProcessing(data)) {
          startPolling();
        }
      })
      .finally(() => setIsLoading(false));

    return () => stopPolling();
  }, [sessionId, fetchAttachments, startPolling, hasProcessing, stopPolling]);

  const refresh = useCallback(() => {
    fetchAttachments().then((data) => {
      if (data && hasProcessing(data)) {
        startPolling();
      }
    });
  }, [fetchAttachments, startPolling, hasProcessing]);

  return { attachments, isLoading, refresh };
}
