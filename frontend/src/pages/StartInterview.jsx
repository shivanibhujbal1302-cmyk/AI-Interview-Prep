import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import SegmentedControl from '../components/SegmentedControl.jsx';
import Badge from '../components/Badge.jsx';
import {
  ANSWER_MODES,
  DIFFICULTIES,
  INTERVIEW_TYPES,
  QUESTION_COUNTS,
  getInterviewType,
} from '../data/interviewOptions.js';
import { saveInterviewConfig } from '../services/interviewService.js';

const DEFAULT_CONFIG = { type: 'Technical', difficulty: 'Medium', questionCount: 5, answerMode: 'both' };

export default function StartInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  // "Practice Again" sends us here with the previous settings.
  const [config, setConfig] = useState(location.state?.config || DEFAULT_CONFIG);

  const selectedType = getInterviewType(config.type);
  const update = (field) => (value) => setConfig({ ...config, [field]: value });

  function handleStart() {
    saveInterviewConfig(config);
    navigate('/interview/session');
  }

  return (
    <>
      <PageHeader title="Configure Your Interview" subtitle="Choose what you want to practice. You can change this every time." />

      <div className="setup">
        <div className="setup__options">
          <Card>
            <h2 className="card-title">Interview type</h2>
            <div className="type-grid" role="radiogroup" aria-label="Interview type">
              {INTERVIEW_TYPES.map(({ id, label, description, icon: Icon }) => {
                const selected = config.type === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`type-card ${selected ? 'type-card--selected' : ''}`}
                    onClick={() => update('type')(id)}
                  >
                    <span className="type-card__icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="type-card__label">{label}</span>
                    <span className="type-card__description">{description}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <h2 className="card-title">Difficulty</h2>
            <SegmentedControl
              label="Difficulty"
              value={config.difficulty}
              onChange={update('difficulty')}
              options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
            />

            <h2 className="card-title card-title--spaced">Number of questions</h2>
            <SegmentedControl
              label="Number of questions"
              value={config.questionCount}
              onChange={update('questionCount')}
              options={QUESTION_COUNTS.map((n) => ({ value: n, label: `${n} questions` }))}
            />

            <h2 className="card-title card-title--spaced">Answer mode</h2>
            <SegmentedControl
              label="Answer mode"
              value={config.answerMode}
              onChange={update('answerMode')}
              options={ANSWER_MODES.map((mode) => ({ value: mode.id, label: mode.label, icon: mode.icon }))}
            />
          </Card>
        </div>

        <Card className="setup__summary">
          <h2 className="card-title">Your interview</h2>
          <dl className="summary-list">
            <div>
              <dt>Type</dt>
              <dd>{selectedType.label}</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>
                <Badge tone="primary">{config.difficulty}</Badge>
              </dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>{config.questionCount}</dd>
            </div>
            <div>
              <dt>Answer mode</dt>
              <dd className="capitalize">{config.answerMode}</dd>
            </div>
          </dl>
          <p className="summary-time">
            <Clock size={16} aria-hidden="true" /> About {config.questionCount * 3} minutes
          </p>
          <Button size="lg" fullWidth onClick={handleStart}>
            <Play size={18} aria-hidden="true" /> Start Interview
          </Button>
        </Card>
      </div>
    </>
  );
}
