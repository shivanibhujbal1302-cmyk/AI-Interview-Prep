import { useState } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { INTERVIEW_TYPES } from '../data/interviewOptions.js';
import { formatDate, getInitials } from '../utils/format.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user.name,
    targetRole: user.targetRole || '',
    bio: user.bio || '',
  });
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [preferred, setPreferred] = useState(user.preferredCategories || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  function addSkill(event) {
    event.preventDefault();
    const skill = newSkill.trim();
    if (skill && !skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkills([...skills, skill]);
    }
    setNewSkill('');
  }

  function toggleCategory(id) {
    setPreferred((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setMessage({ type: 'danger', text: 'Please enter your name.' });
      return;
    }
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({ ...form, name: form.name.trim(), skills, preferredCategories: preferred });
      setMessage({ type: 'success', text: 'Profile saved.' });
    } catch {
      setMessage({ type: 'danger', text: 'We could not save your profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details and practice preferences." />

      <div className="profile">
        <Card className="profile__summary">
          <span className="avatar avatar--lg" aria-hidden="true">
            {getInitials(user.name)}
          </span>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          {user.joinedAt && <p className="muted">Member since {formatDate(user.joinedAt)}</p>}
        </Card>

        <form className="profile__form" onSubmit={handleSave} noValidate>
          <Card>
            <h2 className="card-title">Profile information</h2>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            <Input label="Email" value={user.email} disabled hint="Email cannot be changed in demo mode." />
            <Input label="Target role" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} placeholder="e.g. Software Engineer" />
            <div className="field">
              <label htmlFor="profile-bio" className="field__label">
                About you
              </label>
              <textarea
                id="profile-bio"
                className="textarea"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A few lines about your background and goals"
              />
            </div>
          </Card>

          <Card>
            <h2 className="card-title">Skills and interests</h2>
            <ul className="chip-list">
              {skills.map((skill) => (
                <li key={skill} className="chip">
                  {skill}
                  <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} aria-label={`Remove ${skill}`}>
                    <X size={14} />
                  </button>
                </li>
              ))}
              {skills.length === 0 && <li className="muted">No skills added yet.</li>}
            </ul>
            <div className="skill-add">
              <label htmlFor="new-skill" className="sr-only">
                Add a skill
              </label>
              <input
                id="new-skill"
                className="field__input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill, e.g. Spring Boot"
                onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
              />
              <Button variant="secondary" onClick={addSkill}>
                <Plus size={16} aria-hidden="true" /> Add
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="card-title">Preferred interview categories</h2>
            <div className="chip-list">
              {INTERVIEW_TYPES.map(({ id, label }) => {
                const active = preferred.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    className={`chip chip--toggle ${active ? 'chip--active' : ''}`}
                    onClick={() => toggleCategory(id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Card>

          {message.text && (
            <p className={`alert alert--${message.type}`} role={message.type === 'danger' ? 'alert' : 'status'}>
              {message.type === 'success' && <CheckCircle2 size={18} aria-hidden="true" />}
              {message.text}
            </p>
          )}
          <div>
            <Button type="submit" size="lg" loading={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
