import { Outlet } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo.jsx';

const POINTS = [
  'Scores on relevance, accuracy, and clarity',
  'Voice or text answers',
  'A polished ideal answer for every question',
];

// Split screen for Login / Register: brand panel on the left, form on the right.
export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__brand">
        <Logo light />
        <div>
          <h2 className="auth__headline">Walk into your next interview prepared.</h2>
          <ul className="auth__points">
            {POINTS.map((point) => (
              <li key={point}>
                <CheckCircle2 size={20} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="auth__panel">
        <div className="auth__mobile-logo">
          <Logo />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
