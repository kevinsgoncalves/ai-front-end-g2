import styles from './HistorySidebarEmpty.module.css';

export function HistorySidebarEmpty() {
  return (
    <div className={styles.empty}>
      <p>Nenhuma conversa encontrada.</p>
    </div>
  );
}
