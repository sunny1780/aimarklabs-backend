import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';
import FacebookAdsOverview from './components/FacebookAdsOverview';
import InstagramOverview from './components/InstagramOverview';
import SiteHealthOverview from './components/SiteHealthOverview';

const clientLabels: Record<string, string> = {
  'little-sicily': 'Little Sicily',
  'cash-for-gold': 'Cash for Gold',
  olmdc: 'OLMDC',
  'evolo-ai': 'Evolo AI',
  'party-hall': 'Beckley Party Hall',
  'seagull-seafood': 'Seagull Seafood',
  'walker-advisor': 'Walker Advisor',
};

const tabs = [
  { id: 'monthly', label: 'Monthly Plan' },
  { id: 'site-health', label: 'Site Health' },
  { id: 'web-traffic', label: 'Web Traffic' },
  { id: 'meta-analytics', label: 'Meta Analytics' },
  { id: 'google-ads', label: 'Google Ads' },
  { id: 'google-business', label: 'Google business' },
  { id: 'audit-report', label: 'Audit Report' },
  { id: 'subscription', label: 'Subscription' },
];

const AdminClientDashboard: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscription');
  const lookerStudioReports: Record<string, string> = {
    'little-sicily':
      'https://lookerstudio.google.com/reporting/46ad2f44-db71-4584-8f2d-283dee53d987',
    'cash-for-gold':
      'https://lookerstudio.google.com/u/0/reporting/2c3342e1-f2e2-4423-8cd6-008a145e6be8/page/DqdkE',
    'evolo-ai':
      'https://lookerstudio.google.com/u/0/reporting/1d83589b-34cf-4981-a208-2b83d841dece/page/w4gkE',
    'party-hall':
      'https://lookerstudio.google.com/u/0/reporting/3037419a-81b3-4c0e-8d17-1a319bbee0bd/page/OAikE',
    olmdc:
      'https://lookerstudio.google.com/u/0/reporting/acbe15bf-e922-4d94-8de4-ed870af81a21/page/iTJlE',
    'walker-advisor':
      'https://lookerstudio.google.com/u/0/reporting/35566fb0-1a0a-4bb8-861a-7df8c3985bed/page/DsIlE',
  };
  const lookerStudioUrl = slug ? lookerStudioReports[slug] : undefined;
  const lookerStudioEmbedUrl = lookerStudioUrl
    ? `${lookerStudioUrl.replace('/reporting/', '/embed/reporting/')}?embedded=true`
    : '';

  const clientName = useMemo(() => {
    if (!slug) {
      return 'Client';
    }
    return clientLabels[slug] ?? slug.replace(/-/g, ' ');
  }, [slug]);

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
            className="admin-nav-item active"
            onClick={() => navigate('/admin')}
          >
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

      <main className="admin-main admin-client-main">
        <header className="admin-client-header">
          <div>
            <h1>{clientName}</h1>
            <p>Hi! Welcome to AI Mark Labs</p>
          </div>
          <button
            type="button"
            className="admin-back-btn"
            onClick={() => navigate('/admin')}
          >
            Back
          </button>
        </header>

        <section className="tab-row admin-client-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </section>

        {activeTab === 'monthly' && (
          <section className="admin-empty-card">
            <p>
              It looks like you haven't created any Upload Video yet. Click the
              button "Upload Video" to create your first Upload Video and get
              started!
            </p>
            <button type="button" className="admin-upload-plan-btn">
              Upload Monthly Plan
            </button>
          </section>
        )}

        {activeTab === 'audit-report' && (
          <section className="admin-empty-card">
            <p>
              It looks like you haven't created any Upload Video yet. Click the
              button "Upload Video" to create your first Upload Video and get
              started!
            </p>
            <button type="button" className="admin-upload-plan-btn">
              Upload Audit Report
            </button>
          </section>
        )}

        {activeTab === 'subscription' && (
          <section className="subscription-card">
            <div className="subscription-table">
              <div className="subscription-row subscription-header">
                <span>Subscription</span>
                <span>Status</span>
                <span>Next payment</span>
                <span>Total</span>
              </div>

              <div className="subscription-row">
                <span>Revenue Rocket</span>
                <span className="subscription-status">On hold</span>
                <span>-</span>
                <span>$349.00</span>
              </div>

              <div className="subscription-row">
                <span>Revenue Rocket</span>
                <span className="subscription-status">trash</span>
                <span>-</span>
                <span>$349.00 / month</span>
              </div>
            </div>
          </section>
        )}

        {lookerStudioEmbedUrl && (
          <section
            className="looker-card"
            style={{ display: activeTab === 'web-traffic' ? 'block' : 'none' }}
            aria-hidden={activeTab !== 'web-traffic'}
          >
            <iframe
              className="looker-frame"
              src={lookerStudioEmbedUrl}
              title="Web Traffic Report"
              allowFullScreen
              loading="eager"
            />
          </section>
        )}

        {activeTab === 'meta-analytics' && slug === 'walker-advisor' && (
          <FacebookAdsOverview clientName={clientName} />
        )}

        {activeTab === 'meta-analytics' && slug === 'party-hall' && (
          <InstagramOverview clientName={clientName} clientSlug="party-hall" />
        )}

        {activeTab === 'meta-analytics' &&
          slug !== 'walker-advisor' &&
          slug !== 'party-hall' && (
          <section className="subscription-empty">
            <p>
              Meta analytics is currently configured for Walker Advisor
              (Facebook) and Beckley Party Hall (Instagram).
            </p>
          </section>
        )}

        {activeTab === 'site-health' && slug === 'walker-advisor' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">Site Health Overview</h2>
              <p className="card-subtitle">
                PageSpeed Insights data for Walker Advisor is shown below.
              </p>
            </header>
            <SiteHealthOverview
              clientSlug="walker-advisor"
              brandLabel={clientName}
            />
          </section>
        )}

        {activeTab !== 'monthly' &&
          activeTab !== 'audit-report' &&
          activeTab !== 'subscription' &&
          activeTab !== 'meta-analytics' &&
          activeTab !== 'site-health' &&
          activeTab !== 'web-traffic' && (
          <section className="subscription-empty">
            <p>Content coming soon for this section.</p>
          </section>
        )}

        {activeTab === 'site-health' && slug !== 'walker-advisor' && (
          <section className="subscription-empty">
            <p>Site Health is currently configured for Walker Advisor only.</p>
          </section>
        )}

        {activeTab === 'web-traffic' && !lookerStudioEmbedUrl && (
          <section className="subscription-empty">
            <p>Web Traffic report is not configured for this client.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminClientDashboard;
