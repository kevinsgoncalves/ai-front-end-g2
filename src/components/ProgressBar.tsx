interface ProgressBarProps {
  percent: number;
}

function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progresso: ${percent}%`}
    >
      <div
        className="progress-bar__fill"
        style={{ width: `${percent}%` }}
      />
      <span className="progress-bar__label">{percent}%</span>
    </div>
  );
}

export default ProgressBar;
