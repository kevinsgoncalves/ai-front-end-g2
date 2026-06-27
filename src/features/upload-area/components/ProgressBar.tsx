import type { ProgressBarProps } from '../types/upload';
import styles from './ProgressBar.module.css';

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      className={styles.container}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso do upload"
    >
      <div
        className={styles.fill}
        style={{ width: `${percent}%` }}
      />
      <span className={styles.label}>{percent}%</span>
    </div>
  );
}
