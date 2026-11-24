import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Flame, ListChecks, Play, Target, Inbox } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import StatCard from '../components/StatCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import Skeleton from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getDashboardStats } from '../services/interviewService.js';
import { formatDate, formatShortDate, getFirstName, getGreeting, getScoreTone } from '../utils/format.js';

// Chart colours (charts need real colour values, not CSS variables).
const PRIMARY = '#5b5bf0';
const GRID = '#e8eaf3';
const AXIS = '#8a92ad';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .catch(() => setError('We could not load your dashboard. Please refresh the page.'));
  }, []);

  const startButton = (
    <Button to="/interview/new" size="lg">
      <Play size={18} aria-hidden="true" /> Start New Interview
    </Button>
  );

  return (
    <>
      <PageHeader
        title={`${getGreeting()}, ${getFirstName(user?.name)} 👋`}
        subtitle="Here is how your interview practice is going."
        actions={startButton}
      />

      {error && (
        <p className="alert alert--danger" role="alert">
          {error}
        </p>
      )}
      {!data && !error && <DashboardSkeleton />}
      {data && data.stats.interviewsCompleted === 0 && (
        <Card>
          <EmptyState
            icon={Inbox}
            title="No interviews yet"
            description="Complete your first mock interview to see your stats here."
            action={startButton}
          />
        </Card>
      )}
      {data && data.stats.interviewsCompleted > 0 && <DashboardContent data={data} />}
    </>
  );
}

function DashboardContent({ data }) {
  const { stats, performanceOverTime, categoryPerformance, skills, recentInterviews } = data;
  const chartData = performanceOverTime.map((point) => ({ ...point, label: formatShortDate(point.date) }));

  return (
    <>
      <section className="grid grid--stats" aria-label="Your stats">
        <StatCard icon={CheckCircle2} label="Interviews Completed" value={stats.interviewsCompleted} tone="primary" />
        <StatCard icon={Target} label="Average Score" value={`${stats.averageScore}%`} tone="success" />
        <StatCard icon={ListChecks} label="Questions Practiced" value={stats.questionsPracticed} tone="info" />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`}
          tone="warning"
        />
      </section>

      <section className="grid grid--charts">
        <Card>
          <h2 className="card-title">Performance overview</h2>
          <p className="card-subtitle">Your overall score across recent interviews</p>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: AXIS, fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="score" stroke={PRIMARY} strokeWidth={3} fill="url(#scoreFill)" dot={{ r: 4, fill: PRIMARY }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="card-title">Skills</h2>
          <p className="card-subtitle">Average across all interviews</p>
          <div className="skills">
            {skills.map((skill) => (
              <ProgressBar key={skill.name} label={skill.name} value={skill.score} showValue tone="auto" />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid--bottom">
        <Card>
          <h2 className="card-title">Score by category</h2>
          <p className="card-subtitle">Where you are strongest</p>
          <div className="chart-box chart-box--small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="category" tick={{ fill: AXIS, fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: AXIS, fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f0f1fb' }} />
                <Bar dataKey="score" fill={PRIMARY} radius={[8, 8, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="card-row">
            <h2 className="card-title">Recent interviews</h2>
            <Link to="/history" className="text-link">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table table--responsive">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Interview Type</th>
                  <th>Questions</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((interview) => (
                  <tr key={interview.id}>
                    <td data-label="Date">{formatDate(interview.date)}</td>
                    <td data-label="Interview Type">
                      <Link to={`/results/${interview.id}`} className="text-link">
                        {interview.category}
                      </Link>
                    </td>
                    <td data-label="Questions">{interview.totalQuestions}</td>
                    <td data-label="Score">
                      <Badge tone={getScoreTone(interview.overallScore)}>{interview.overallScore}%</Badge>
                    </td>
                    <td data-label="Status">
                      <Badge tone="success">{interview.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{point.score}%</strong>
      <span>{[point.category, point.label].filter(Boolean).join(' · ')}</span>
    </div>
  );
}

// Grey placeholder shapes shown while the dashboard loads.
function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard...">
      <div className="grid grid--stats">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} height={92} radius={16} />
        ))}
      </div>
      <div className="grid grid--charts">
        <Skeleton height={340} radius={16} />
        <Skeleton height={340} radius={16} />
      </div>
      <p className="sr-only">Loading dashboard...</p>
    </div>
  );
}
