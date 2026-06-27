import styles from './HistorySidebarError.module.css';

export interface HistorySidebarErrorProps {
  message: string;
  onRetry: () => void;
}

export function HistorySidebarError({ message, onRetry }: HistorySidebarErrorProps) {
  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}
