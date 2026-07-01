import { useState, useEffect, useCallback } from 'react';
import type { ConversationItemData } from '../types/historySidebar';
import { fetchConversations } from '../services/historySidebarService';
import {
  createSession as apiCreateSession,
  deleteSession as apiDeleteSession,
  updateSessionTitle as apiUpdateSessionTitle,
} from '../../../services/sessionService';

export function useHistorySidebar() {
  const [conversations, setConversations] = useState<ConversationItemData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingTitleId, setUpdatingTitleId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar histórico.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectSession = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const createSession = useCallback(async (title: string) => {
    try {
      const session = await apiCreateSession(title);
      setConversations((prev) => [
        {
          id: session.id,
          title: session.title,
          date: session.createdAt,
          messageCount: 0,
        },
        ...prev,
      ]);
      setSelectedId(session.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar sessão.';
      setError(message);
    }
  }, []);

  const deleteSession = useCallback(async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await apiDeleteSession(id);
      const isDeletingActive = selectedId === id;
      const deletedIdx = conversations.findIndex((c) => c.id === id);
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (isDeletingActive) {
        const remaining = conversations.filter((conv) => conv.id !== id);
        if (remaining.length === 0) {
          setSelectedId(null);
        } else {
          const nextIndex = Math.min(deletedIdx, remaining.length - 1);
          setSelectedId(remaining[nextIndex].id);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao excluir sessão.';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }, [selectedId, conversations]);

  const updateConversationTitle = useCallback(
    (id: number, title: string) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, title } : conv)),
      );
    },
    [],
  );

  const updateTitle = useCallback(
    async (id: number, title: string) => {
      setUpdatingTitleId(id);
      try {
        const session = await apiUpdateSessionTitle(id, title);
        setConversations((prev) =>
          prev.map((conv) => (conv.id === id ? { ...conv, title: session.title } : conv)),
        );
      } finally {
        setUpdatingTitleId(null);
      }
    },
    [],
  );

  return {
    conversations,
    selectedId,
    isLoading,
    error,
    deletingId,
    updatingTitleId,
    selectSession,
    refresh,
    createSession,
    deleteSession,
    updateConversationTitle,
    updateTitle,
  };
}
