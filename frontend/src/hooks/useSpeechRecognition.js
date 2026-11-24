import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Wraps the browser's built-in Web Speech API (works in Chrome and Edge).
// No audio is ever uploaded: the browser turns speech into text for us.
//
// Returns:
//   supported  - false if this browser has no speech recognition
//   listening  - true while the microphone is active
//   transcript - text heard since the last start()
//   error      - a friendly message if something went wrong
//   start / stop
// ---------------------------------------------------------------------------

const SpeechRecognitionAPI =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

function toFriendlyError(code) {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Allow microphone permission in your browser and try again.';
    case 'no-speech':
      return "We didn't hear anything. Try speaking closer to your microphone.";
    case 'audio-capture':
      return 'No microphone was found. Please connect one and try again.';
    case 'network':
      return 'Speech recognition needs an internet connection in this browser.';
    default:
      return 'Something went wrong with voice input. You can type your answer instead.';
  }
}

export default function useSpeechRecognition({ language = 'en-US' } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const supported = Boolean(SpeechRecognitionAPI);

  const start = useCallback(() => {
    if (!supported || recognitionRef.current) return;

    setError('');
    setTranscript('');

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = true; // keep listening until we call stop()
    recognition.interimResults = true; // show words while the person is still speaking

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript.trim())
        .join(' ');
      setTranscript(text);
    };
    recognition.onerror = (event) => setError(toFriendlyError(event.error));
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setError(toFriendlyError('unknown'));
    }
  }, [supported, language]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Make sure the microphone is released when the component disappears.
  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, transcript, error, start, stop };
}
