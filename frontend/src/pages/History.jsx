import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, History as HistoryIcon, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { getInterviews } from '../services/interviewService.js';
import { formatDate, getDifficultyTone, getScoreTone } from '../utils/format.js';

export default function History() {
  const [interviews, setInterviews] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getInterviews()
      .then(setInterviews)
      .catch(() => setError('We could not load your history. Please refresh the page.'));
  }, []);

  const categories = interviews ? ['All', ...new Set(interviews.map((i) => i.category))] : ['All'];
  const visible = interviews ? interviews.filter((i) => filter === 'All' || i.category === filter) : [];

  return (
    <>
      <PageHeader
        title="Interview History"
        subtitle="Every interview you have completed."
        actions={
          <Button to="/interview/new">
            <Play size={18} aria-hidden="true" /> Start New Interview
          </Button>
        }
      />

      {error && (
        <p className="alert alert--danger" role="alert">
          {error}
        </p>
      )}

      {!interviews && !error && (
        <div role="status" aria-label="Loading history...">
          <Skeleton height={260} radius={16} />
        </div>
      )}

      {interviews && interviews.length === 0 && (
        <Card>
          <EmptyState
            icon={HistoryIcon}
            title="No interviews yet"
            description="Your completed interviews will appear here."
            action={<Button to="/interview/new">Start your first interview</Button>}
          />
        </Card>
      )}

      {interviews && interviews.length > 0 && (
        <Card>
          <div className="card-row">
            <h2 className="card-title">{visible.length} interviews</h2>
            <label className="filter">
              <span className="sr-only">Filter by type</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All types' : category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="table-wrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Questions</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((interview) => (
                  <tr key={interview.id}>
                    <td data-label="Date">{formatDate(interview.date)}</td>
                    <td data-label="Type">{interview.category}</td>
                    <td data-label="Difficulty">
                      <Badge tone={getDifficultyTone(interview.difficulty)}>{interview.difficulty}</Badge>
                    </td>
                    <td data-label="Score">
                      <Badge tone={getScoreTone(interview.overallScore)}>{interview.overallScore}%</Badge>
                    </td>
                    <td data-label="Questions">{interview.totalQuestions}</td>
                    <td data-label="">
                      <Link to={`/results/${interview.id}`} className="btn btn--secondary btn--sm">
                        <Eye size={16} aria-hidden="true" /> View Result
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
