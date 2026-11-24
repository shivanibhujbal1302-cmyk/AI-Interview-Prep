import { useState } from 'react';
import { Keyboard, Mic, Send, SkipForward } from 'lucide-react';
import Card from './Card.jsx';
import Button from './Button.jsx';
import VoiceRecorder from './VoiceRecorder.jsx';
import { countWords } from '../utils/format.js';

// Where the user writes or speaks their answer.
//   answerMode: 'text' | 'voice' | 'both'
// onSubmit receives 'text' or 'voice' (which tab was used).
export default function AnswerBox({ answerMode = 'both', value, onChange, onSubmit, onSkip, error }) {
  const [activeTab, setActiveTab] = useState(answerMode === 'voice' ? 'voice' : 'text');
  const showTabs = answerMode === 'both';

  return (
    <Card className="answer-box">
      <div className="answer-box__header">
        <h3 className="answer-box__title">Your answer</h3>

        {showTabs && (
          <div className="tabs" role="tablist" aria-label="Answer method">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'text'}
              className={`tabs__tab ${activeTab === 'text' ? 'tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <Keyboard size={16} aria-hidden="true" /> Text
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'voice'}
              className={`tabs__tab ${activeTab === 'voice' ? 'tabs__tab--active' : ''}`}
              onClick={() => setActiveTab('voice')}
            >
              <Mic size={16} aria-hidden="true" /> Voice
            </button>
          </div>
        )}
      </div>

      {activeTab === 'text' ? (
        <div>
          <label htmlFor="answer-text" className="sr-only">
            Type your answer
          </label>
          <textarea
            id="answer-text"
            className="textarea textarea--large"
            rows={9}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Type your answer here..."
          />
        </div>
      ) : (
        <VoiceRecorder value={value} onChange={onChange} />
      )}

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}

      <div className="answer-box__footer">
        <span className="answer-box__count">{countWords(value)} words</span>
        <div className="answer-box__actions">
          <Button variant="ghost" onClick={onSkip}>
            <SkipForward size={18} aria-hidden="true" /> Skip Question
          </Button>
          <Button onClick={() => onSubmit(activeTab)}>
            <Send size={18} aria-hidden="true" /> Submit Answer
          </Button>
        </div>
      </div>
    </Card>
  );
}
