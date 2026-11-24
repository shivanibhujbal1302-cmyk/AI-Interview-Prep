import { getScoreTone } from '../utils/format.js';

// A horizontal bar.  tone="auto" picks green / amber / red from the value.
export default function ProgressBar({ value, max = 100, label, showValue = false, tone = 'primary', size = 'md' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const fillTone = tone === 'auto' ? getScoreTone(percent) : tone;

  return (
    <div className="progress">
      {(label || showValue) && (
        <div className="progress__meta">
          <span>{label}</span>
          {showValue && <span className="progress__value">{Math.round(value)}</span>}
        </div>
      )}
      <div
        className={`progress__track progress__track--${size}`}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div className={`progress__fill progress__fill--${fillTone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
