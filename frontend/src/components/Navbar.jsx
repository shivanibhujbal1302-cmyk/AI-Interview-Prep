import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
];

// The top bar of the public landing page.
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo light />

        <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}

          <div className="navbar__actions">
            {isAuthenticated ? (
              <Button to="/dashboard" variant="light" size="sm">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button to="/login" variant="ghost-light" size="sm">
                  Login
                </Button>
                <Button to="/register" variant="light" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>

        <button
          type="button"
          className="icon-button icon-button--light navbar__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
