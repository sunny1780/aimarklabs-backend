import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const AdminAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'logout'>('details');
  const navigate = useNavigate();

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img
            src="/images/logo.png"
            alt="AI Mark Labs Logo"
            className="admin-logo"
          />
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className="admin-nav-item"
            onClick={() => navigate('/admin')}
          >
            <span className="admin-nav-icon">O</span>
            Our Clients
          </button>
          <button type="button" className="admin-nav-item active">
            <span className="admin-nav-icon">O</span>
            Account
          </button>
        </nav>

        <div className="admin-user">
          <div className="admin-user-avatar">WW</div>
          <div className="admin-user-text">
            <span className="admin-user-name">Wade Warren</span>
            <span className="admin-user-role">Engineer</span>
          </div>
        </div>
      </aside>

      <main className="admin-main admin-account-main">
        <header className="admin-client-header">
          <div>
            <h1>Account</h1>
            <p>View Recent Schemas Below, See All in Schema History.</p>
          </div>
          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate('/admin')}
          >
            Back
          </button>
        </header>

        <section className="admin-account-tabs">
          <button
            type="button"
            className={activeTab === 'details' ? 'active' : ''}
            onClick={() => setActiveTab('details')}
          >
            Account Details
          </button>
          <button
            type="button"
            className={activeTab === 'logout' ? 'active' : ''}
            onClick={() => setActiveTab('logout')}
          >
            Logout
          </button>
        </section>

        {activeTab === 'details' ? (
          <section className="admin-account-card">
            <div className="admin-account-photo">
              <div className="admin-account-avatar">WW</div>
              <div className="admin-account-photo-actions">
                <button type="button" className="ghost-link">
                  Remove Photo
                </button>
                <button type="button" className="ghost-pill">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="admin-account-divider" />

            <form className="admin-account-form">
              <div className="admin-form-row">
                <label>
                  First name <span className="required">*</span>
                  <input type="text" placeholder="Placeholder" />
                </label>
                <label>
                  Last name <span className="required">*</span>
                  <input type="text" placeholder="Placeholder" />
                </label>
              </div>
              <div className="admin-form-row">
                <label>
                  Display name <span className="required">*</span>
                  <input type="text" placeholder="Placeholder" />
                </label>
                <label>
                  Email address <span className="required">*</span>
                  <input type="email" placeholder="Placeholder" />
                </label>
              </div>

              <div className="admin-form-section">
                <h3>Password change</h3>
                <label>
                  Current password (leave blank to leave unchanged)
                  <input type="password" placeholder="Placeholder" />
                </label>
                <label>
                  New password (leave blank to leave unchanged)
                  <input type="password" placeholder="Placeholder" />
                </label>
                <label>
                  Confirm new password
                  <input type="password" placeholder="Placeholder" />
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-modal-cancel">
                  Cancel
                </button>
                <button type="button" className="admin-modal-submit">
                  Save Edits
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="admin-logout-card">
            <div className="admin-logout-icon">
              <span className="admin-logout-triangle" />
              <span className="admin-logout-mark">!</span>
            </div>
            <h2>Log Out</h2>
            <p>
              Are you sure you would like to log out of your
              <strong> AI Mark Labs </strong>
              account?
            </p>
            <div className="admin-logout-actions">
              <button type="button" className="admin-modal-cancel">
                Cancel
              </button>
              <button type="button" className="admin-modal-submit">
                Log Out
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminAccount;
