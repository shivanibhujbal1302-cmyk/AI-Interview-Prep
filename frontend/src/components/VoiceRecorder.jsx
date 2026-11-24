import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Mic, Square } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition.js';
import { formatDuration } from '../utils/format.js';

// Record your voice and see it turn into editable text.
// The parent owns the text: we receive `value` and report changes with `onChange`.
export default function VoiceRecorder({ value, onChange, disabled = false }) {
  const { supported, listening, transcript, error, start, stop } = useSpeechRecognition();
  const [seconds, setSeconds] = useState(0);

  // Text that was already in the box before this recording started.
  const textBeforeRecordingRef = useRef('');
  const hasStartedRef = useRef(false);

  // Timer: counts seconds while recording.
  useEffect(() => {
    if (!listening) return undefined;
    setSeconds(0);
    const timer = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => clearInterval(timer);
  }, [listening]);

  // Whenever new words are heard, put them into the text box.
  useEffect(() => {
    if (!hasStartedRef.current) return;
    onChange(textBeforeRecordingRef.current + transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  function handleToggle() {
    if (listening) {
      stop();
      return;
    }
    textBeforeRecordingRef.current = value.trim() ? `${value.trim()} ` : '';
    hasStartedRef.current = true;
    start();
  }

  return (
    <div className="voice">
      {!supported && (
        <div className="alert alert--warning" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>Voice input is not supported in this browser. Please use Chrome or enter your answer manually.</span>
        </div>
      )}

      {supported && (
        <div className="voice__stage">
          <button
            type="button"
            className={`voice__button ${listening ? 'voice__button--active' : ''}`}
            onClick={handleToggle}
            disabled={disabled}
            aria-pressed={listening}
            aria-label={listening ? 'Stop recording' : 'Start recording'}
          >
            {listening ? <Square size={30} aria-hidden="true" /> : <Mic size={36} aria-hidden="true" />}
          </button>
          <p className="voice__label">{listening ? 'Stop Recording' : 'Start Recording'}</p>
          <p className="voice__status" aria-live="polite">
            {listening ? (
              <>
                <span className="voice__dot" aria-hidden="true" />
                Recording... <strong>{formatDuration(seconds)}</strong>
              </>
            ) : value ? (
              'Recording stopped. You can edit the transcript below.'
            ) : (
              'Tap the microphone and start speaking.'
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}

      <label htmlFor="voice-transcript" className="field__label">
        Transcript <span className="field__label-note">(you can edit it)</span>
      </label>
      <textarea
        id="voice-transcript"
        className="textarea"
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Your spoken answer will appear here..."
        disabled={disabled}
      />
    </div>
  );
}
