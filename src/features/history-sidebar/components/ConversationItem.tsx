import type { ConversationItemData } from '../types/historySidebar';
import { formatDate } from '../utils/historySidebarUtils';
import styles from './ConversationItem.module.css';

export interface ConversationItemProps {
  conversation: ConversationItemData;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(conversation.id)}
    >
      <span className={styles.title}>{conversation.title}</span>
      <time className={styles.date}>{formatDate(conversation.date)}</time>
      <span className={styles.count}>
        {conversation.messageCount} mensagens
      </span>
    </li>
  );
}
