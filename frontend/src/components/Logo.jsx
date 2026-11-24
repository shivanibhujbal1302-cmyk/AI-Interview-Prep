import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className={`logo ${light ? 'logo--light' : ''}`} aria-label="AI Interview Prep home">
      <span className="logo__mark">
        <BrainCircuit size={20} aria-hidden="true" />
      </span>
      <span className="logo__text">
        AI Interview <strong>Prep</strong>
      </span>
    </Link>
  );
}
