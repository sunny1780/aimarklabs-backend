import React from 'react';

type ActiveSection = 'analytics' | 'audit' | 'packages' | 'account';

interface SidebarProps {
  activeSection: ActiveSection;
  onChangeSection: (section: ActiveSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onChangeSection }) => {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src="/images/logo.png"
          alt="AI Mark Lab Logo"
          className="w-28 h-auto object-contain"
        />
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => onChangeSection('analytics')}
        >
          <span className="nav-dot" />
          <span>Analytics</span>
        </button>
        {canViewAuditReport ? (
          <button
            type="button"
            className={`nav-item ${activeSection === 'audit' ? 'active' : ''}`}
            onClick={() => onChangeSection('audit')}
          >
            <span className="nav-dot" />
            <span>Audit Report</span>
          </button>
        ) : null}
        <button
          type="button"
          className={`nav-item ${activeSection === 'packages' ? 'active' : ''}`}
          onClick={() => onChangeSection('packages')}
        >
          <span className="nav-dot" />
          <span>Packages</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
          onClick={() => onChangeSection('account')}
        >
          <span className="nav-dot" />
          <span>Account</span>
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{avatarLetter}</div>
        <div className="user-info">
          <div className="user-name">{displayName}</div>
          <div className="user-role">{displaySubtext}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
