import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type ActiveSection = 'analytics' | 'audit' | 'packages' | 'account';

interface SidebarProps {
  activeSection: ActiveSection;
  onChangeSection: (section: ActiveSection) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onChangeSection, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const activeEmail =
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_active_email') || '' : '';
  const activeClientSlug =
    typeof window !== 'undefined' ? localStorage.getItem('dashboard_active_client_slug') || '' : '';

  const clientNameBySlug: Record<string, string> = {
    'little-sicily': 'Little Sicily',
    'cash-for-gold': 'Cash For Gold Beckley',
    'karachi-bbq': 'Karachi BBQ',
    'evolo-ai': 'Evolo AI',
  };

  const displayName = clientNameBySlug[activeClientSlug]
    || (activeEmail.includes('@') ? activeEmail.split('@')[0] : activeEmail)
    || 'Guest User';
  const displaySubtext = activeEmail || 'Client Account';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'U';

  const canViewAuditReport =
    typeof window !== 'undefined' &&
    localStorage.getItem('dashboard_active_email') === 'karachibbq@gmail.com';

  const handleSectionChange = (section: ActiveSection) => {
    onChangeSection(section);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/" aria-label="Go to landing page">
          <img
            src="/images/logo.png"
            alt="AI Mark Lab Logo"
            className="w-28 h-auto object-contain"
          />
        </Link>
        <button
          type="button"
          className="sidebar-menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <nav className={`sidebar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button
          type="button"
          className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => handleSectionChange('analytics')}
        >
          <span className="nav-dot" />
          <span>Analytics</span>
        </button>
        {canViewAuditReport ? (
          <button
            type="button"
            className={`nav-item ${activeSection === 'audit' ? 'active' : ''}`}
            onClick={() => handleSectionChange('audit')}
          >
            <span className="nav-dot" />
            <span>Audit Report</span>
          </button>
        ) : null}
        <button
          type="button"
          className={`nav-item ${activeSection === 'packages' ? 'active' : ''}`}
          onClick={() => handleSectionChange('packages')}
        >
          <span className="nav-dot" />
          <span>Packages</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => handleSectionChange('account')}
        >
          <span className="nav-dot" />
          <span>Account</span>
        </button>
        <button
          type="button"
          className="nav-item nav-item-logout"
          onClick={onLogout}
        >
          <span className="nav-dot" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="sidebar-user-wrap" ref={userMenuRef}>
        <button
          type="button"
          className="sidebar-user sidebar-user-trigger"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          aria-expanded={isUserMenuOpen}
          aria-label="Toggle account options"
        >
          <div className="user-avatar">{avatarLetter}</div>
          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-role">{displaySubtext}</div>
          </div>
          <span className={`sidebar-user-chevron ${isUserMenuOpen ? 'open' : ''}`}>▾</span>
        </button>
        {isUserMenuOpen ? (
          <div className="sidebar-user-menu">
            <button
              type="button"
              className="sidebar-user-menu-item"
              onClick={onLogout}
            >
              <span className="sidebar-user-menu-item-icon">↪</span>
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default Sidebar;
