import styles from './HistorySidebarSkeleton.module.css';

export interface HistorySidebarSkeletonProps {
  lines?: number;
}

export function HistorySidebarSkeleton({ lines = 4 }: HistorySidebarSkeletonProps) {
  return (
    <div className={styles.skeleton} aria-busy="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={styles.line} />
      ))}
    </div>
  );
}
