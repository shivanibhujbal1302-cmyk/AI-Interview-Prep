import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <div className="center-page">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or has been moved."
        action={<Button to="/">Back to home</Button>}
      />
    </div>
  );
}
