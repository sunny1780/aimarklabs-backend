import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { getClients, mergeClients } from './utils/auth';

type Client = {
  name: string;
  slug: string;
  accent: string;
};

const defaultClients: Client[] = [
  { name: 'Little Sicily', slug: 'little-sicily', accent: '#f59e0b' },
  { name: 'Cash for Gold', slug: 'cash-for-gold', accent: '#fbbf24' },
  { name: 'OLMDC', slug: 'olmdc', accent: '#22c55e' },
  { name: 'Evolo AI', slug: 'evolo-ai', accent: '#60a5fa' },
  { name: 'Beckley Party Hall', slug: 'party-hall', accent: '#f97316' },
  { name: 'Seagull Seafood', slug: 'seagull-seafood', accent: '#38bdf8' },
  { name: 'Walker Advisor', slug: 'walker-advisor', accent: '#a78bfa' },
];

const AdminDashboard: React.FC = () => {
  const [showAddClient, setShowAddClient] = useState(false);
  const [clients] = useState<Client[]>(() =>
    mergeClients(defaultClients, getClients())
  );
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
          <button type="button" className="admin-nav-item active">
            <span className="admin-nav-icon">O</span>
            Our Clients
          </button>
          <button
            type="button"
            className="admin-nav-item"
            onClick={() => navigate('/admin/account')}
          >
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

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Hi! Welcome to AI Mark Labs</p>
          </div>
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setShowAddClient(true)}
          >
            <span className="admin-add-icon">+</span>
            Add Client
          </button>
        </header>

        <section className="admin-search">
          <input type="search" placeholder="Search Clients" />
        </section>

        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Clients</h2>
          </div>

          <div className="admin-cards">
            {clients.map((client, index) => (
              <article
                key={client.name}
                className="admin-card"
                style={
                  {
                    '--delay': `${index * 0.08}s`,
                    '--accent': client.accent,
                  } as React.CSSProperties
                }
              >
                <div className="admin-card-head">
                  <h3>{client.name}</h3>
                  <div className="admin-card-logo">
                    {client.name
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 3)
                      .join('')
                      .toUpperCase()}
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-card-btn"
                  onClick={() => navigate(`/admin/client/${client.slug}`)}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>

        <footer className="admin-footer">
          <span>Showing 1 to 6 out of 6 results</span>
          <button type="button" className="admin-next-btn">
            Next
          </button>
        </footer>

        {showAddClient && (
          <div className="admin-modal-overlay" onClick={() => setShowAddClient(false)}>
            <div
              className="admin-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h3>Add Client</h3>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setShowAddClient(false)}
                >
                  x
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="admin-modal-row">
                  <label>
                    Company Name
                    <input type="text" placeholder="AI Mark Labs" />
                  </label>
                  <label>
                    Username
                    <input type="text" placeholder="amna" />
                  </label>
                </div>
                <div className="admin-modal-row">
                  <label className="full">
                    Password
                    <div className="admin-password-field">
                      <input type="password" placeholder="**************" />
                      <span className="admin-password-toggle">o</span>
                    </div>
                  </label>
                </div>
                <button type="button" className="admin-upload-btn">
                  + Upload Logo
                </button>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  onClick={() => setShowAddClient(false)}
                >
                  Cancel
                </button>
                <button type="button" className="admin-modal-submit">
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
