import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, RotateCcw, SearchX, TrendingDown, TrendingUp } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ScoreCircle from '../components/ScoreCircle.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { getInterviewById } from '../services/interviewService.js';
import { formatDate, getScoreTone } from '../utils/format.js';

const BREAKDOWN_ROWS = [
  ['Relevance', 'relevance'],
  ['Accuracy', 'accuracy'],
  ['Completeness', 'completeness'],
  ['Clarity', 'clarity'],
  ['Communication', 'communication'],
];

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const justCompleted = Boolean(location.state?.justCompleted);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getInterviewById(id)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading result..." fullPage />;

  if (!result) {
    return (
      <Card>
        <EmptyState
          icon={SearchX}
          title="Interview not found"
          description="We could not find this interview. It may have been removed."
          action={<Button to="/history">Go to history</Button>}
        />
      </Card>
    );
  }

  const tone = getScoreTone(result.overallScore);

  return (
    <div className="result">
      <header className="result__header">
        <Link to="/history" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> History
        </Link>
        <h1 className="page-header__title">{justCompleted ? 'Interview Complete 🎉' : 'Interview Result'}</h1>
        <p className="page-header__subtitle">
          {result.category} · {result.difficulty} · {formatDate(result.date)}
        </p>
      </header>

      <Card className="result__hero">
        <ScoreCircle score={result.overallScore} size={170} strokeWidth={13} caption="overall" />
        <div className="result__summary">
          <p className="result__score-line">
            Overall Score: <strong className={`tone-text tone-text--${tone}`}>{result.overallScore}%</strong>
          </p>
          <p>{result.summary}</p>
          <p className="result__meta">
            {result.answeredCount} of {result.totalQuestions} questions answered
            {result.skippedCount > 0 && ` · ${result.skippedCount} skipped`}
          </p>
        </div>
      </Card>

      <div className="result__grid">
        <Card>
          <h2 className="card-title">Score breakdown</h2>
          <div className="skills">
            {BREAKDOWN_ROWS.map(([label, key]) => (
              <ProgressBar key={key} label={label} value={result.breakdown[key]} showValue tone="auto" />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="card-title">
            <TrendingUp size={18} aria-hidden="true" /> Strong areas
          </h2>
          {result.strongAreas.length > 0 ? (
            <ul className="topic-list">
              {result.strongAreas.map((topic) => (
                <li key={topic.topic}>
                  <span>{topic.topic}</span>
                  <Badge tone="success">{topic.averageScore}%</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No standout topics yet. Keep practicing to build strengths.</p>
          )}

          <h2 className="card-title card-title--spaced">
            <TrendingDown size={18} aria-hidden="true" /> Weak areas
          </h2>
          {result.weakAreas.length > 0 ? (
            <ul className="topic-list">
              {result.weakAreas.map((topic) => (
                <li key={topic.topic}>
                  <span>{topic.topic}</span>
                  <Badge tone="danger">{topic.averageScore}%</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No weak areas this time. Nice work!</p>
          )}
        </Card>

        <Card>
          <h2 className="card-title">
            <BookOpen size={18} aria-hidden="true" /> Recommended topics
          </h2>
          <ul className="chip-list">
            {result.recommendedTopics.map((topic) => (
              <li key={topic}>
                <Badge tone="primary">{topic}</Badge>
              </li>
            ))}
          </ul>
          <p className="muted">Review these topics before your next practice session.</p>
        </Card>
      </div>

      <section aria-labelledby="review-heading">
        <h2 id="review-heading" className="section-title">
          Question review
        </h2>
        <div className="review-list">
          {result.answers.map((item, index) => (
            <details key={index} className="review-item">
              <summary>
                <span className="review-item__question">
                  {index + 1}. {item.question}
                </span>
                {item.skipped ? (
                  <Badge>Skipped</Badge>
                ) : (
                  <Badge tone={getScoreTone(item.feedback.overallScore)}>{item.feedback.overallScore}%</Badge>
                )}
              </summary>
              <div className="review-item__body">
                {item.skipped ? (
                  <p className="muted">You skipped this question.</p>
                ) : (
                  <>
                    <h3 className="review-item__label">Your answer</h3>
                    <p className="review-item__answer">{item.answerText}</p>
                    <FeedbackPanel feedback={item.feedback} />
                  </>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="result__actions">
        <Button
          size="lg"
          onClick={() => navigate('/interview/new', { state: { config: { type: result.category, difficulty: result.difficulty, questionCount: result.totalQuestions, answerMode: 'both' } } })}
        >
          <RotateCcw size={18} aria-hidden="true" /> Practice Again
        </Button>
        <Button to="/dashboard" variant="secondary" size="lg">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
