import { useState, useEffect, useCallback } from 'react';
import type { ConversationItemData } from '../types/historySidebar';
import { fetchConversations } from '../services/historySidebarService';

export function useHistorySidebar() {
  const [conversations, setConversations] = useState<ConversationItemData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    conversations,
    selectedId,
    isLoading,
    error,
    selectSession,
    refresh,
  };
}
