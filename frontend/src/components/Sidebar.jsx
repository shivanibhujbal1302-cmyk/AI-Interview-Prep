import { NavLink, useNavigate } from 'react-router-dom';
import { History, LayoutDashboard, LogOut, PlayCircle, User, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { getInitials } from '../utils/format.js';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interview/new', label: 'New Interview', icon: PlayCircle },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

// The dark navigation menu on the left of every logged-in page.
// On phones it slides in from the side (controlled by `open`).
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      {open && <button type="button" className="sidebar-overlay" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__top">
          <Logo to="/dashboard" light />
          <button type="button" className="icon-button icon-button--light sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <span className="avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </span>
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.name}</p>
            <p className="sidebar__user-email">{user?.email}</p>
          </div>
          <button type="button" className="icon-button icon-button--light" onClick={handleLogout} aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
