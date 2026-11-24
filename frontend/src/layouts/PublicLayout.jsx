import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Logo from '../components/Logo.jsx';

// Wrapper for public pages: top navbar + page + footer.
export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <Logo light />
            <p>Practice smarter. Interview better.</p>
          </div>
          <nav className="footer__links" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
          </nav>
          <p className="footer__copy">© {new Date().getFullYear()} AI Interview Prep. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
