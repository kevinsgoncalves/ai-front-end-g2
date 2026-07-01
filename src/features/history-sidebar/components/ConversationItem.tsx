import { useState, useEffect, useCallback, useRef } from 'react';
import type { ConversationItemData } from '../types/historySidebar';
import { formatDate } from '../utils/historySidebarUtils';
import styles from './ConversationItem.module.css';

export interface ConversationItemProps {
  conversation: ConversationItemData;
  isSelected: boolean;
  isDeleting: boolean;
  updatingTitleId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateTitle: (id: number, title: string) => Promise<void>;
}

export function ConversationItem({
  conversation,
  isSelected,
  isDeleting,
  updatingTitleId,
  onSelect,
  onDelete,
  onUpdateTitle,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(conversation.title);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);
  const isSaving = updatingTitleId === conversation.id;

  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        cancelEdit();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue(conversation.title);
    setValidationError(null);
  }, [conversation.title]);

  const startEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(conversation.title);
    setValidationError(null);
    setIsEditing(true);
  }, [conversation.title]);

  const handleSave = useCallback(async () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setValidationError('O título não pode ficar vazio.');
      return;
    }
    if (trimmed === conversation.title) {
      setIsEditing(false);
      return;
    }
    setValidationError(null);
    try {
      await onUpdateTitle(conversation.id, trimmed);
      setIsEditing(false);
    } catch {
      setValidationError('Erro ao salvar. Tente novamente.');
    }
  }, [editValue, conversation.id, conversation.title, onUpdateTitle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
    [handleSave, cancelEdit],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const title = conversation.title || 'sem título';
      const confirmed = window.confirm(
        `Tem certeza que deseja excluir a sessão "${title}"? Esta ação é permanente.`,
      );
      if (!confirmed) return;
      onDelete(conversation.id);
    },
    [conversation.id, conversation.title, onDelete],
  );

  if (isEditing) {
    return (
      <li
        ref={containerRef}
        className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      >
        <div className={styles.editArea}>
          <input
            ref={inputRef}
            className={`${styles.editInput} ${validationError ? styles.editInputError : ''}`}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Título da sessão"
            disabled={isSaving}
          />
          {validationError && (
            <span className={styles.editError} role="alert">
              {validationError}
            </span>
          )}
        </div>
        <button
          type="button"
          className={styles.saveButton}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          disabled={isSaving || !editValue.trim()}
          aria-label="Salvar título"
          title="Salvar"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={(e) => {
            e.stopPropagation();
            cancelEdit();
          }}
          disabled={isSaving}
          aria-label="Cancelar edição"
          title="Cancelar"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </li>
    );
  }

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
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.editButton}
          onClick={startEdit}
          aria-label={`Editar título da sessão ${conversation.title}`}
          title="Editar título"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
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
      </div>
    </li>
  );
}
