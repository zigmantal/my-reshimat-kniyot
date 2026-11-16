interface ProgressBarProps {
  done: number;
  total: number;
}

/** פס התקדמות חי: כמה פריטים כבר נקנו מתוך כלל הרשימה. */
export default function ProgressBar({ done, total }: ProgressBarProps) {
  if (total === 0) return null;

  const percent = Math.round((done / total) * 100);
  const complete = done === total;

  return (
    <div className={`progress-card ${complete ? 'progress-card-complete' : ''}`}>
      <div className="progress-card-text">
        <span>{complete ? '🎉 הכול נקנה!' : `נקנו ${done} מתוך ${total}`}</span>
        <span className="progress-card-percent">{percent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="התקדמות הקנייה"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
