import { MessageSquareQuote } from 'lucide-react';
import Card from './Card.jsx';
import Badge from './Badge.jsx';
import { getDifficultyTone } from '../utils/format.js';

export default function QuestionCard({ question }) {
  return (
    <Card className="question-card">
      <div className="question-card__meta">
        <span className="question-card__icon">
          <MessageSquareQuote size={18} aria-hidden="true" />
        </span>
        <Badge tone="primary">{question.category}</Badge>
        <Badge tone={getDifficultyTone(question.difficulty)}>{question.difficulty}</Badge>
        <Badge>{question.topic}</Badge>
      </div>
      <h2 className="question-card__text">{question.question}</h2>
    </Card>
  );
}
