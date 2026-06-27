interface ProgressBarProps {
  progress?: number;
}

function ProgressBar({ progress = 0 }: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-bar" aria-label={`Upload ${safeProgress}%`}>
      <div
        className="progress-bar__fill"
        style={{ width: `${safeProgress}%` }}
      />
      <span className="progress-bar__label">{safeProgress}%</span>
    </div>
  );
}

export default ProgressBar;
