import { useEffect, useState } from 'react';
import { getScoreTone } from '../utils/format.js';

// A circular score indicator that animates from 0 to the score.
export default function ScoreCircle({ score, size = 148, strokeWidth = 11, caption = 'out of 100' }) {
  const [shownScore, setShownScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShownScore(score), 60);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - shownScore / 100);

  return (
    <div
      className={`score-circle score-circle--${getScoreTone(score)}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score: ${score} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="score-circle__track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" />
        <circle
          className="score-circle__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="score-circle__label">
        <span className="score-circle__number">{score}</span>
        <span className="score-circle__caption">{caption}</span>
      </div>
    </div>
  );
}
