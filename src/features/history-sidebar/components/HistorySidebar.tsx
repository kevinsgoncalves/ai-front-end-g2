import type { ConversationItemData } from '../types/historySidebar';
import { ConversationItem } from './ConversationItem';
import { HistorySidebarSkeleton } from './HistorySidebarSkeleton';
import { HistorySidebarEmpty } from './HistorySidebarEmpty';
import { HistorySidebarError } from './HistorySidebarError';
import styles from './HistorySidebar.module.css';

export interface HistorySidebarProps {
  conversations: ConversationItemData[];
  selectedId: number | null;
  isLoading: boolean;
  error: string | null;
  onSelectSession: (id: number) => void;
  onRefresh: () => void;
  onRetry: () => void;
}

export function HistorySidebar({
  conversations,
  selectedId,
  isLoading,
  error,
  onSelectSession,
  onRefresh,
  onRetry,
}: HistorySidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Histórico</h2>
        <button
          className={styles.refreshButton}
          onClick={onRefresh}
          aria-label="Atualizar histórico"
        >
          ↻
        </button>
      </div>

      {isLoading && <HistorySidebarSkeleton />}
      {!isLoading && error && <HistorySidebarError message={error} onRetry={onRetry} />}
      {!isLoading && !error && conversations.length === 0 && <HistorySidebarEmpty />}
      {!isLoading && !error && conversations.length > 0 && (
        <ul className={styles.list} role="listbox">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onSelect={onSelectSession}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}
