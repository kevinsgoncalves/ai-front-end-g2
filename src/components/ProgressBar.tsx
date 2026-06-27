function ProgressBar() {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso do upload"
    >
      <div className="progress-bar__fill" style={{ width: '0%' }} />
      <span className="progress-bar__label">0%</span>
    </div>
  );
}

export default ProgressBar;
