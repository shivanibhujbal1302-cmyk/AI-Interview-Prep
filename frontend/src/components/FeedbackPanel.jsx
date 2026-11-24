import { AlertCircle, Lightbulb, Sparkles, ThumbsUp, TrendingUp } from 'lucide-react';
import Card from './Card.jsx';
import ScoreCircle from './ScoreCircle.jsx';
import ProgressBar from './ProgressBar.jsx';
import FeedbackCard from './FeedbackCard.jsx';

const SCORE_ROWS = [
  ['Relevance', 'relevanceScore'],
  ['Accuracy', 'accuracyScore'],
  ['Completeness', 'completenessScore'],
  ['Clarity', 'clarityScore'],
  ['Communication', 'communicationScore'],
];

// The full AI feedback screen for one answer.
// `feedback` has the same shape the backend AI endpoint will return.
// Anything passed as children (e.g. the "Next Question" button) appears at the bottom.
export default function FeedbackPanel({ feedback, children }) {
  return (
    <div className="feedback-panel">
      <Card className="feedback-panel__score-card">
        <ScoreCircle score={feedback.overallScore} />
        <div className="feedback-panel__details">
          <h3 className="feedback-panel__heading">Your score</h3>
          <p className="feedback-panel__summary">{feedback.summary}</p>
          <div className="feedback-panel__bars">
            {SCORE_ROWS.map(([label, key]) => (
              <ProgressBar key={key} label={label} value={feedback[key]} showValue tone="auto" size="sm" />
            ))}
          </div>
        </div>
      </Card>

      <div className="feedback-panel__grid">
        <FeedbackCard title="What you did well" icon={ThumbsUp} tone="success" items={feedback.strengths} />
        <FeedbackCard title="What to improve" icon={TrendingUp} tone="warning" items={feedback.weaknesses} />
        <FeedbackCard title="Missing points" icon={AlertCircle} tone="danger" items={feedback.missingPoints} />
        <FeedbackCard title="AI suggestion" icon={Lightbulb} tone="info" items={feedback.improvementTips} />
      </div>

      <FeedbackCard title="Ideal answer" icon={Sparkles} tone="primary">
        <p className="feedback-card__quote">{feedback.idealAnswer}</p>
      </FeedbackCard>

      {children && <div className="feedback-panel__actions">{children}</div>}
    </div>
  );
}
