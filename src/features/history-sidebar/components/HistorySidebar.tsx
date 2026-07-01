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
  deletingId: number | null;
  updatingTitleId: number | null;
  onSelectSession: (id: number) => void;
  onDeleteSession: (id: number) => void;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
  onRefresh: () => void;
  onRetry: () => void;
  onCreateSession?: () => void;
}

export function HistorySidebar({
  conversations,
  selectedId,
  isLoading,
  error,
  deletingId,
  updatingTitleId,
  onSelectSession,
  onDeleteSession,
  onUpdateTitle,
  onRefresh,
  onRetry,
  onCreateSession,
}: HistorySidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sessões</h2>
        <button
          className={styles.refreshButton}
          onClick={onRefresh}
          aria-label="Atualizar histórico"
        >
          ↻
        </button>
      </div>

      {onCreateSession && (
        <button className={styles.newSessionBtn} onClick={onCreateSession} type="button">
          + Nova sessão
        </button>
      )}

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
              isDeleting={conv.id === deletingId}
              updatingTitleId={updatingTitleId}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
              onUpdateTitle={onUpdateTitle}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}
