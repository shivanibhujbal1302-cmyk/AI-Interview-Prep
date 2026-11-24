import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { isValidEmail } from '../utils/validators.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function validate() {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Please enter your email.';
    else if (!isValidEmail(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (!form.password) newErrors.password = 'Please enter your password.';
    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setFormMessage('');
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormMessage(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">Welcome back</h1>
      <p className="auth-form__subtitle">Log in to continue practicing.</p>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" value={form.email} onChange={updateField('email')} error={errors.email} />
        <Input label="Password" type="password" icon={Lock} placeholder="Enter your password" autoComplete="current-password" value={form.password} onChange={updateField('password')} error={errors.password} />

        {formMessage && (
          <p className="alert alert--danger" role="alert">
            {formMessage}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="auth-form__divider">
        <span>or</span>
      </div>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => setFormMessage('Google sign-in is coming soon. Please use email and password for now.')}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        Continue with Google
      </Button>

      <p className="auth-form__switch">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
      
    </div>
  );
}
