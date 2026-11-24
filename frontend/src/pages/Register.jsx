import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { isValidEmail } from '../utils/validators.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function validate() {
    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = 'Please enter your name.';
    if (!form.email.trim()) newErrors.email = 'Please enter your email.';
    else if (!isValidEmail(form.email)) newErrors.email = 'Please enter a valid email address.';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match.';
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
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFormMessage(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">Create your account</h1>
      <p className="auth-form__subtitle">Start practicing in under a minute.</p>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Name" icon={User} placeholder="Your full name" autoComplete="name" value={form.name} onChange={updateField('name')} error={errors.name} />
        <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" value={form.email} onChange={updateField('email')} error={errors.email} />
        <Input label="Password" type="password" icon={Lock} placeholder="At least 8 characters" autoComplete="new-password" value={form.password} onChange={updateField('password')} error={errors.password} />
        <Input label="Confirm password" type="password" icon={Lock} placeholder="Repeat your password" autoComplete="new-password" value={form.confirmPassword} onChange={updateField('confirmPassword')} error={errors.confirmPassword} />

        {formMessage && (
          <p className="alert alert--danger" role="alert">
            {formMessage}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="auth-form__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
