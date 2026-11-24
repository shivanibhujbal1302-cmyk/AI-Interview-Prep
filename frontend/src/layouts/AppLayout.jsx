import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import Logo from '../components/Logo.jsx';

// Wrapper for all logged-in pages: sidebar + content area.
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // On every page change: close the mobile menu and scroll back to the top.
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-shell__content">
        <div className="mobile-topbar">
          <button type="button" className="icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Logo to="/dashboard" />
        </div>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
