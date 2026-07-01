import type { ConversationItemData } from '../types/historySidebar';
import { formatDate } from '../utils/historySidebarUtils';
import styles from './ConversationItem.module.css';

export interface ConversationItemProps {
  conversation: ConversationItemData;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  isDeleting,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = conversation.title || 'sem título';
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a sessão "${title}"? Esta ação é permanente.`,
    );
    if (!confirmed) return;
    onDelete(conversation.id);
  };

  return (
    <li className={`${styles.item} ${isSelected ? styles.selected : ''}`}>
      <button
        className={styles.selectButton}
        onClick={() => onSelect(conversation.id)}
        aria-current={isSelected ? 'true' : undefined}
        type="button"
      >
        <span className={styles.title}>{conversation.title}</span>
        <time className={styles.date}>{formatDate(conversation.date)}</time>
        <span className={styles.count}>
          {conversation.messageCount} mensagens
        </span>
      </button>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Excluir sessão ${conversation.title}`}
        title="Excluir sessão"
        type="button"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        </svg>
      </button>
    </li>
  );
}
