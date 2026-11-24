import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`loading ${fullPage ? 'loading--page' : ''}`} role="status" aria-live="polite">
      <Loader2 className="spin" size={28} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
