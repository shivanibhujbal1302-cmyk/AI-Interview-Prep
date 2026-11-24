import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Info, RefreshCw, Sparkles, TriangleAlert, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import AnswerBox from '../components/AnswerBox.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import {
  USING_MOCK_DATA,
  analyzeAnswer,
  clearInterviewConfig,
  getQuestions,
  loadInterviewConfig,
  saveInterview,
} from '../services/interviewService.js';
import { buildInterviewResult } from '../utils/interviewResult.js';

// The core page. `status` tells us what to show:
//   loading   -> fetching questions
//   answering -> user writes/speaks an answer
//   analyzing -> waiting for the AI
//   feedback  -> showing the AI feedback
//   saving    -> saving the finished interview
//   saveError / loadError -> something failed
export default function Interview() {
  const navigate = useNavigate();
  const config = useMemo(() => loadInterviewConfig(), []);

  const [status, setStatus] = useState('loading');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [answers, setAnswers] = useState([]); // everything answered or skipped so far
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (!config) return undefined;
    let cancelled = false;

    getQuestions({ type: config.type, difficulty: config.difficulty, count: config.questionCount })
      .then((loaded) => {
        if (cancelled) return;
        setQuestions(loaded);
        setStatus('answering');
      })
      .catch(() => {
        if (!cancelled) setStatus('loadError');
      });

    return () => {
      cancelled = true;
    };
  }, [config]);

  useEffect(() => {
    if (status === 'feedback') feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [status]);

  // No setup found (e.g. the user opened this URL directly): go to the setup page.
  if (!config) return <Navigate to="/interview/new" replace />;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const completedCount = status === 'feedback' ? currentIndex + 1 : currentIndex;

  async function handleSubmit(answerType) {
    const trimmed = answerText.trim();
    if (trimmed.length < 5) {
      setErrorMessage('Please write or record an answer before submitting.');
      return;
    }

    setErrorMessage('');
    setStatus('analyzing');
    try {
      const feedback = await analyzeAnswer({
        question: currentQuestion.question,
        answer: trimmed,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
      });
      setAnswers((previous) => [
        ...previous,
        { question: currentQuestion, answerText: trimmed, answerType, skipped: false, feedback },
      ]);
      setCurrentFeedback(feedback);
      setStatus('feedback');
    } catch (error) {
      setErrorMessage(error.message || 'We could not analyze your answer. Please try again.');
      setStatus('answering');
    }
  }

  function handleSkip() {
    const updated = [
      ...answers,
      { question: currentQuestion, answerText: '', answerType: 'text', skipped: true, feedback: null },
    ];
    setAnswers(updated);
    goToNextStep(updated);
  }

  function goToNextStep(updatedAnswers) {
    if (isLastQuestion) {
      finishInterview(updatedAnswers);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setAnswerText('');
    setCurrentFeedback(null);
    setErrorMessage('');
    setStatus('answering');
  }

  async function finishInterview(finalAnswers) {
    setStatus('saving');
    try {
      const result = buildInterviewResult({ config, answers: finalAnswers });
      await saveInterview(result);
      clearInterviewConfig();
      navigate(`/results/${result.id}`, { replace: true, state: { justCompleted: true } });
    } catch {
      setStatus('saveError');
    }
  }

  // ----- Full-page states -----
  if (status === 'loading') return <LoadingSpinner label="Loading questions..." fullPage />;
  if (status === 'saving') return <LoadingSpinner label="Saving interview..." fullPage />;

  if (status === 'loadError' || status === 'saveError') {
    const isSaveError = status === 'saveError';
    return (
      <Card>
        <EmptyState
          icon={TriangleAlert}
          title={isSaveError ? 'We could not save your interview' : 'We could not load your questions'}
          description="Please check your connection and try again."
          action={
            <Button onClick={() => (isSaveError ? finishInterview(answers) : window.location.reload())}>
              <RefreshCw size={18} aria-hidden="true" /> Try again
            </Button>
          }
        />
      </Card>
    );
  }

  // ----- Main interview screen -----
  return (
    <div className="interview">
      <header className="interview__header">
        <div>
          <p className="interview__title">
            {config.type} Interview <Badge tone="primary">{config.difficulty}</Badge>
          </p>
          <h1 className="interview__counter">
            Question {currentIndex + 1} of {questions.length}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowExitModal(true)}>
          <X size={16} aria-hidden="true" /> Exit
        </Button>
      </header>

      <ProgressBar value={completedCount} max={questions.length} label="Interview progress" />

      <QuestionCard question={currentQuestion} />

      {status === 'answering' && (
        <AnswerBox
          key={currentIndex}
          answerMode={config.answerMode}
          value={answerText}
          onChange={setAnswerText}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          error={errorMessage}
        />
      )}

      {status === 'analyzing' && (
        <Card className="analyzing" role="status" aria-live="polite">
          <span className="analyzing__icon">
            <Sparkles size={26} aria-hidden="true" />
          </span>
          <h2>Analyzing your answer...</h2>
          <p>Checking relevance, accuracy, completeness, and clarity.</p>
          <span className="analyzing__bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </Card>
      )}

      {status === 'feedback' && currentFeedback && (
        <div ref={feedbackRef} className="interview__feedback">
          {USING_MOCK_DATA && (
            <p className="alert alert--info">
              <Info size={18} aria-hidden="true" />
              <span>Demo feedback: real AI analysis is connected in a later phase.</span>
            </p>
          )}
          <FeedbackPanel feedback={currentFeedback}>
            <Button size="lg" onClick={() => goToNextStep(answers)}>
              {isLastQuestion ? 'Finish Interview' : 'Next Question'} <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </FeedbackPanel>
        </div>
      )}

      <Modal
        open={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Leave this interview?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowExitModal(false)}>
              Keep practicing
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearInterviewConfig();
                navigate('/dashboard');
              }}
            >
              Leave interview
            </Button>
          </>
        }
      >
        <p>Your progress in this interview will not be saved.</p>
      </Modal>
    </div>
  );
}
