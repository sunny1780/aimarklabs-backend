import React, { useMemo, useState } from 'react';
import './App.css';
import MetaAnalyticsSection from './components/MetaAnalyticsSection';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

type DashboardClient = {
  name: string;
  brandLabel: string;
  webTrafficEmbedUrl: string;
  metaAdsEmbedUrl: string;
  auditReportPreviewUrl: string;
  auditReportDownloadUrl: string;
  hasAnalyticsData: boolean;
  showAuditPreview: boolean;
};

const DASHBOARD_CLIENTS: Record<string, DashboardClient> = {
  'little-sicily': {
    name: 'Little Sicily',
    brandLabel: 'Little Sicily',
    webTrafficEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/46ad2f44-db71-4584-8f2d-283dee53d987/page/mYGiE',
    metaAdsEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/a92fbd55-ba1d-496d-a97d-ac8f8cb0a2ce/page/p_afos27a1oc',
    auditReportPreviewUrl:
      'https://docs.google.com/document/d/1C5WM69kPVt29Jdk-gPMpyOTqyUzpJP49JpY7R2vzgHY/preview',
    auditReportDownloadUrl:
      'https://docs.google.com/document/d/1C5WM69kPVt29Jdk-gPMpyOTqyUzpJP49JpY7R2vzgHY/export?format=pdf',
    hasAnalyticsData: true,
    showAuditPreview: true,
  },
  'cash-for-gold': {
    name: 'Cash For Gold Beckley',
    brandLabel: 'Cash 4 Gold',
    webTrafficEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/2c3342e1-f2e2-4423-8cd6-008a145e6be8/page/DqdkE',
    metaAdsEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/a2fc2c1b-9bd1-4b70-9262-b6169e4dca26/page/p_afos27a1oc',
    auditReportPreviewUrl:
      'https://docs.google.com/document/d/1sAEEpYjvi4MRlPrbXNywfqmKiWLz80-zqV0KDt49pmM/preview',
    auditReportDownloadUrl:
      'https://docs.google.com/document/d/1sAEEpYjvi4MRlPrbXNywfqmKiWLz80-zqV0KDt49pmM/export?format=pdf',
    hasAnalyticsData: true,
    showAuditPreview: true,
  },
  'karachi-bbq': {
    name: 'Karachi BBQ',
    brandLabel: 'Karachi BBQ',
    webTrafficEmbedUrl: '',
    metaAdsEmbedUrl: '',
    auditReportPreviewUrl:
      '/images/Karachi-BBQ-Tonight-Digital-Marketing-Audit.pdf',
    auditReportDownloadUrl:
      '/images/Karachi-BBQ-Tonight-Digital-Marketing-Audit.pdf',
    hasAnalyticsData: false,
    showAuditPreview: true,
  },
  'evolo-ai': {
    name: 'Evolo AI',
    brandLabel: 'Evolo AI',
    webTrafficEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/1d83589b-34cf-4981-a208-2b83d841dece/page/w4gkE',
    metaAdsEmbedUrl: '',
    auditReportPreviewUrl:
      'https://docs.google.com/document/d/1C5WM69kPVt29Jdk-gPMpyOTqyUzpJP49JpY7R2vzgHY/preview',
    auditReportDownloadUrl:
      'https://docs.google.com/document/d/1C5WM69kPVt29Jdk-gPMpyOTqyUzpJP49JpY7R2vzgHY/export?format=pdf',
    hasAnalyticsData: true,
    showAuditPreview: true,
  },
};

const AnalyticsDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'analytics' | 'audit' | 'packages' | 'account'
  >('analytics');
  const [activeTab, setActiveTab] = useState<'monthly' | 'siteHealth' | 'webTraffic' | 'metaAnalytics' | 'googleAds' | 'googleBusiness'>('monthly');
  const [activePackageTab, setActivePackageTab] = useState<
    'everything' | 'reputation' | 'branding' | 'website' | 'app' | 'uiux'
  >('everything');
  const [activeAccountTab, setActiveAccountTab] = useState<
    'subscription' | 'details' | 'logout'
  >('subscription');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const activeClient = useMemo(() => {
    if (typeof window === 'undefined') return DASHBOARD_CLIENTS['little-sicily'];
    const clientSlug =
      localStorage.getItem('dashboard_active_client_slug') || 'little-sicily';
    return DASHBOARD_CLIENTS[clientSlug] || DASHBOARD_CLIENTS['little-sicily'];
  }, []);
  const isAuditPdf = activeClient.auditReportPreviewUrl
    .toLowerCase()
    .includes('.pdf');
  const auditPdfPreviewUrl = isAuditPdf
    ? `${activeClient.auditReportPreviewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : activeClient.auditReportPreviewUrl;

  return (
    <div className="analytics-app">
      <Sidebar activeSection={activeSection} onChangeSection={setActiveSection} />

      <main className="main-content">
        <TopBar
          activeSection={activeSection}
          showCheckout={showCheckout}
          showThankYou={showThankYou}
          onOpenCart={() => setIsCartOpen(true)}
          onBackToDashboards={() => {
            setShowCheckout(false);
            setShowThankYou(false);
          }}
        />

        {showThankYou && (
          <section className="thankyou-card">
            <div className="thankyou-icon">
              <span className="thankyou-check">✓</span>
            </div>
            <h2 className="thankyou-title">Thank You</h2>
            <p className="thankyou-text">
              Check your email for order confirmation.
            </p>
          </section>
        )}

        {showCheckout && !showThankYou && (
          <section className="checkout-layout">
            <div className="checkout-main">
              <h2 className="checkout-section-title">Enter Shipping Address</h2>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>
                    First name <span className="required">*</span>
                  </label>
                  <input type="text" placeholder="Placeholder" />
                </div>
                <div className="checkout-field">
                  <label>
                    Last name <span className="required">*</span>
                  </label>
                  <input type="text" placeholder="Placeholder" />
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>City <span className="required">*</span></label>
                  <input type="text" placeholder="Placeholder" />
                </div>
                <div className="checkout-field">
                  <label>Postal Code <span className="required">*</span></label>
                  <input type="text" placeholder="Placeholder" />
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Street Number &amp; PO box <span className="required">*</span></label>
                  <input type="text" placeholder="Placeholder" />
                </div>
                <div className="checkout-field">
                  <label>Company <span className="required">*</span></label>
                  <input type="text" placeholder="Placeholder" />
                </div>
              </div>

              <div className="checkout-row">
                <div className="checkout-field full">
                  <label>Country <span className="required">*</span></label>
                  <div className="checkout-select">
                    <input type="text" placeholder="Placeholder" />
                    <span className="checkout-select-arrow">▾</span>
                  </div>
                </div>
              </div>

              <h2 className="checkout-section-title">Enter Contact Info</h2>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Email <span className="required">*</span></label>
                  <input type="email" placeholder="Placeholder" />
                </div>
                <div className="checkout-field">
                  <label>Mobile Number <span className="required">*</span></label>
                  <input type="text" placeholder="Placeholder" />
                </div>
              </div>

              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="payment-method-card">
                <div className="payment-method-tabs">
                  <button type="button" className="payment-tab active">
                    ◉ Credit Card
                  </button>
                </div>

                <div className="checkout-row">
                  <div className="checkout-field">
                    <label>Cardholder name <span className="required">*</span></label>
                    <input type="text" placeholder="Christie Doe" />
                  </div>
                  <div className="checkout-field">
                    <label>Card Number <span className="required">*</span></label>
                    <input type="text" placeholder="5261 4141 0151 8472" />
                  </div>
                </div>

                <div className="checkout-row">
                  <div className="checkout-field">
                    <label>Expiry date <span className="required">*</span></label>
                    <input type="text" placeholder="06 / 2024" />
                  </div>
                  <div className="checkout-field">
                    <label>CVV / CVC <span className="required">*</span></label>
                    <input type="text" placeholder="915" />
                  </div>
                </div>

                <div className="checkout-checkbox-row">
                  <input type="checkbox" id="billingSame" />
                  <label htmlFor="billingSame">
                    Billing and Shipping details are the same
                  </label>
                </div>

                <button
                  type="button"
                  className="place-order-btn"
                  onClick={() => setShowThankYou(true)}
                >
                  Place Order
                </button>

                <p className="checkout-disclaimer">
                  By continuing, I confirm that I have read and accept the Terms and Conditions and
                  the Privacy Policy.
                </p>
              </div>
            </div>

            <aside className="checkout-summary">
              <div className="checkout-summary-header">
                <span className="checkout-summary-icon">🛒</span>
                <h3>Cart Summary</h3>
              </div>

              <div className="checkout-summary-items">
                <div className="checkout-summary-item">
                  <div>
                    <div className="cart-item-title">Revenue Rocket</div>
                    <div className="cart-item-subtitle">
                      Free Trail Insights Art Plan Ideal for beginner artists.
                    </div>
                  </div>
                  <button type="button" className="cart-item-remove">
                    🗑 Remove
                  </button>
                </div>

                <div className="checkout-summary-item">
                  <div>
                    <div className="cart-item-title">Revenue Rocket</div>
                    <div className="cart-item-subtitle">
                      Free Trail Insights Art Plan Ideal for beginner artists.
                    </div>
                  </div>
                  <button type="button" className="cart-item-remove">
                    🗑 Remove
                  </button>
                </div>
              </div>

              <div className="checkout-summary-footer">
                <span>SUBTOTAL - $696.69 USD</span>
              </div>
            </aside>
          </section>
        )}
        {!showCheckout &&
          !showThankYou &&
          activeSection === 'analytics' &&
          !activeClient.hasAnalyticsData && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">Analytics</h2>
              <p className="card-subtitle">
                Analytics data is currently not available. Professional insights will appear here once reporting is configured.
              </p>
            </header>
          </section>
        )}
        {!showCheckout &&
          !showThankYou &&
          activeSection === 'analytics' &&
          activeClient.hasAnalyticsData && (
        <>
        <section className="tab-row">
          <button
            className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Plan
          </button>
          <button
            className={`tab ${activeTab === 'siteHealth' ? 'active' : ''}`}
            onClick={() => setActiveTab('siteHealth')}
          >
            Site Health
          </button>
          <button
            className={`tab ${activeTab === 'webTraffic' ? 'active' : ''}`}
            onClick={() => setActiveTab('webTraffic')}
          >
            Web Traffic
          </button>
          <button
            className={`tab ${activeTab === 'metaAnalytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metaAnalytics')}
          >
            Meta Analytics
          </button>
          <button
            className={`tab ${activeTab === 'googleAds' ? 'active' : ''}`}
            onClick={() => setActiveTab('googleAds')}
          >
            Google Ads
          </button>
          <button
            className={`tab ${activeTab === 'googleBusiness' ? 'active' : ''}`}
            onClick={() => setActiveTab('googleBusiness')}
          >
            Google business
          </button>
        </section>

        {activeTab === 'monthly' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <a
                className="audit-button"
                href={activeClient.auditReportDownloadUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download Monthly Plan
              </a>
            </div>
            <section className="card audit-card">
              <div style={{ width: '100%', minHeight: '80vh', borderRadius: '20px', overflow: 'hidden' }}>
                <iframe
                  title="Monthly Plan"
                  src={activeClient.auditReportPreviewUrl}
                  width="100%"
                  height="900"
                  style={{ border: 0, background: '#fff' }}
                />
              </div>
            </section>
          </>
        )}

        {activeTab === 'siteHealth' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">{`Site Health For ${activeClient.name}`}</h2>
              <p className="card-subtitle">
                In February, we&apos;ll enhance online presence, improve website
                functionality, connect with customers through Valentine&apos;s Day
                promotions on social media, and run targeted ads focused on the
                Beckley area.
              </p>
            </header>

            <div className="site-health-layout">
              <div className="site-health-header-bar">
                <div className="site-health-brand">
                  <div className="site-health-brand-logo">{activeClient.brandLabel}</div>
                </div>
                <button className="site-health-date">
                  Nov 15, 2025 - Nov 22, 2025 ▾
                </button>
              </div>

              <div className="site-health-section">
                <h3 className="site-health-section-title">Website Health</h3>
                <div className="site-health-panel wide">
                  <p className="site-health-muted">
                    The Health Score shows how well a website is doing
                  </p>
                  <div className="site-health-icon-row">
                    <span className="site-health-icon">🔧</span>
                    <div className="site-health-panel-text">
                      <div>Looker Studio cannot connect to your data set.</div>
                      <button className="site-health-link">See details</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="site-health-columns">
                <div className="site-health-section">
                  <h3 className="site-health-section-title">Health score history</h3>
                  <div className="site-health-panel tall">
                    <div className="site-health-icon-row center">
                      <span className="site-health-icon">🔧</span>
                      <div className="site-health-panel-text center-text">
                        <div>Data Set Configuration Error</div>
                        <div className="site-health-muted">
                          Looker Studio cannot connect to your data set.
                        </div>
                        <button className="site-health-link">See details</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="site-health-section">
                  <h3 className="site-health-section-title">Issues distribution</h3>
                  <div className="site-health-panel tall">
                    <div className="site-health-icon-row center">
                      <span className="site-health-icon">🔧</span>
                      <div className="site-health-panel-text center-text">
                        <div>Looker Studio cannot connect to your data set.</div>
                        <button className="site-health-link">See details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="site-health-bottom-grid">
                <div className="site-health-section">
                  <h3 className="site-health-section-title">
                    HTTP status codes distribution
                  </h3>
                  <div className="site-health-panel">
                    <div className="site-health-icon-row center">
                      <span className="site-health-icon">🔧</span>
                      <div className="site-health-panel-text center-text">
                        <div>Data Set Configuration Error</div>
                        <div className="site-health-muted">
                          Looker Studio cannot connect to your data set.
                        </div>
                        <button className="site-health-link">See details</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="site-health-section">
                  <h3 className="site-health-section-title">Content type distribution</h3>
                  <div className="site-health-panel">
                    <div className="site-health-icon-row center">
                      <span className="site-health-icon">🔧</span>
                      <div className="site-health-panel-text center-text">
                        <div>Data Set Configuration Error</div>
                        <div className="site-health-muted">
                          Looker Studio cannot connect to your data set.
                        </div>
                        <button className="site-health-link">See details</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="site-health-section">
                  <h3 className="site-health-section-title">Protocols distribution</h3>
                  <div className="site-health-panel">
                    <div className="site-health-icon-row center">
                      <span className="site-health-icon">🔧</span>
                      <div className="site-health-panel-text center-text">
                        <div>Data Set Configuration Error</div>
                        <div className="site-health-muted">
                          Looker Studio cannot connect to your data set.
                        </div>
                        <button className="site-health-link">See details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'webTraffic' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">{`Web Traffic For ${activeClient.name}`}</h2>
            </header>

            <div className="web-traffic-layout">
              <iframe
                title="Web Traffic Looker Studio"
                src={activeClient.webTrafficEmbedUrl}
                width="600"
                height="450"
                style={{ border: 0, width: '100%', maxWidth: '100%' }}
                frameBorder={0}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </section>
        )}

        {activeTab === 'metaAnalytics' && (
          <MetaAnalyticsSection
            clientName={activeClient.name}
            brandLabel={activeClient.brandLabel}
            metaAdsReportUrl={activeClient.metaAdsEmbedUrl}
          />
        )}

        {activeTab === 'googleAds' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">{`Google Ads For ${activeClient.name}`}</h2>
              <p className="card-subtitle">
                In February, we&apos;ll enhance online presence, improve website
                functionality, connect with customers through Valentine&apos;s Day
                promotions on social media, and run targeted ads focused on the
                Beckley area.
              </p>
            </header>

            <div className="google-ads-layout">
              <div className="google-ads-inner">
                <div className="google-ads-logo" />
                <p className="google-ads-text">
                  No advertisements are launched this month,
                  <br />
                  as per your request.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'googleBusiness' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">{`Google Ads For ${activeClient.name}`}</h2>
              <p className="card-subtitle">
                In February, we&apos;ll enhance online presence, improve website
                functionality, connect with customers through Valentine&apos;s Day
                promotions on social media, and run targeted ads focused on the
                Beckley area.
              </p>
            </header>

            <div className="google-biz-layout">
              <div className="google-biz-inner">
                <div className="google-biz-logo" />
                <p className="google-biz-text">
                  Once you share access, we&apos;ll provide you with
                  <br />
                  detailed insights and results for your Google
                  <br />
                  My Business profile.
                </p>
              </div>
            </div>
          </section>
        )}
        </>
        )}

        {!showCheckout && !showThankYou && activeSection === 'audit' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <a
                className="audit-button"
                href={activeClient.auditReportDownloadUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download Report
              </a>
            </div>
            {activeClient.showAuditPreview ? (
              <section className="card audit-card">
                <div style={{ width: '100%', minHeight: '80vh', borderRadius: '20px', overflow: 'hidden' }}>
                  {isAuditPdf ? (
                    <iframe
                      title="Audit Report PDF Read Only"
                      src={auditPdfPreviewUrl}
                      width="100%"
                      height="900"
                      style={{ border: 0, background: '#fff' }}
                    />
                  ) : (
                    <iframe
                      title="Audit Report"
                      src={activeClient.auditReportPreviewUrl}
                      width="100%"
                      height="900"
                      style={{ border: 0, background: '#fff' }}
                    />
                  )}
                </div>
              </section>
            ) : (
              <section className="card">
                <header className="card-header">
                  <h2 className="card-title">Audit Report</h2>
                  <p className="card-subtitle">
                    Preview is not available here. Please use the Download Report button.
                  </p>
                </header>
              </section>
            )}
          </>
        )}

        {!showCheckout && !showThankYou && activeSection === 'packages' && (
          <section className="card packages-card">
            <div className="packages-tabs">
              <button
                className={`packages-tab ${
                  activePackageTab === 'everything' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('everything')}
              >
                Everything You Need
              </button>
              <button
                className={`packages-tab ${
                  activePackageTab === 'reputation' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('reputation')}
              >
                Reputation Management
              </button>
              <button
                className={`packages-tab ${
                  activePackageTab === 'branding' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('branding')}
              >
                Branding/Designs
              </button>
              <button
                className={`packages-tab ${
                  activePackageTab === 'website' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('website')}
              >
                Website Development
              </button>
              <button
                className={`packages-tab ${
                  activePackageTab === 'app' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('app')}
              >
                App Development
              </button>
              <button
                className={`packages-tab ${
                  activePackageTab === 'uiux' ? 'active' : ''
                }`}
                type="button"
                onClick={() => setActivePackageTab('uiux')}
              >
                UI/UX
              </button>
            </div>

            {activePackageTab === 'everything' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Revenue Rocket</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$349</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>3 Graphical Posts</li>
                    <li>3 Text Posts</li>
                    <li>Cross Posts</li>
                    <li>1 Logo</li>
                    <li>1 Google Ads</li>
                    <li>7 Website</li>
                    <li>Maintenance</li>
                    <li>5 Backlinks</li>
                    <li>2 Blogs</li>
                    <li>Technical SEO</li>
                    <li>On-Page Optimization</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Profit Prodigy</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$799</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>3 Graphical Posts</li>
                    <li>3 Text Posts</li>
                    <li>Cross Posts</li>
                    <li>1 Logo</li>
                    <li>1 Google Ads</li>
                    <li>7 Website</li>
                    <li>Maintenance</li>
                    <li>5 Backlinks</li>
                    <li>2 Blogs</li>
                    <li>Technical SEO</li>
                    <li>On-Page Optimization</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Growth Gator</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>3 Graphical Posts</li>
                    <li>3 Text Posts</li>
                    <li>Cross Posts</li>
                    <li>1 Logo</li>
                    <li>1 Google Ads</li>
                    <li>7 Website</li>
                    <li>Maintenance</li>
                    <li>5 Backlinks</li>
                    <li>2 Blogs</li>
                    <li>Technical SEO</li>
                    <li>On-Page Optimization</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Domination Decoder</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>3 Graphical Posts</li>
                    <li>3 Text Posts</li>
                    <li>Cross Posts</li>
                    <li>1 Logo</li>
                    <li>1 Google Ads</li>
                    <li>7 Website</li>
                    <li>Maintenance</li>
                    <li>5 Backlinks</li>
                    <li>2 Blogs</li>
                    <li>Technical SEO</li>
                    <li>On-Page Optimization</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}

            {activePackageTab === 'reputation' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Essentials</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$299</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>5 Posts per month</li>
                    <li>1 Campaigns, We Create 1 Campaigns to run advertising of your brand</li>
                    <li>Monthly Analytics</li>
                    <li>Reputation Management</li>
                    <li>Videos</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$799</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>10 Posts Per Month 1 Design 5 Products</li>
                    <li>2 Campaigns, We Create 2 Campaigns to run advertising of your brand</li>
                    <li>Monthly Analytics</li>
                    <li>Reputation Management</li>
                    <li>Videos</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1199</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>15 Posts Per Month 1 Design 5 Products</li>
                    <li>3 Campaigns, We Create 3 Campaigns to run advertising of your brand</li>
                    <li>1 Videos</li>
                    <li>Monthly Analytics</li>
                    <li>Reputation Management</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$2299</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>30 Posts Per Month 1 Design 5 Products</li>
                    <li>5 Campaigns, We Create 5 Campaigns to run advertising of your brand</li>
                    <li>4 Videos</li>
                    <li>Monthly Analytics</li>
                    <li>Reputation Management</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}

            {activePackageTab === 'branding' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Essentials</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$149</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We visualize your idea into a wire frame.</li>
                    <li>You get 3 Logo Designs as per your briefing &amp; fine tune the one you select.</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$299</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We visualize your idea into a wire frame.</li>
                    <li>You get 3 Logo Designs as per your briefing &amp; fine tune the one you select.</li>
                    <li>
                      A Detailed Branding portfolio on fonts, colors &amp; typography perfect for
                      long-term workability.
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We visualize your idea into a wire frame.</li>
                    <li>You get 3 Logo Designs as per your briefing &amp; fine tune the one you select.</li>
                    <li>
                      A Detailed Branding portfolio on fonts, colors &amp; typography perfect for
                      long-term workability.
                    </li>
                    <li>
                      We design 3 Stationary designs for your brand like Letter Heads, Visiting
                      Cards &amp; policy envelopes.
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$599</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We visualize your idea into a wire frame.</li>
                    <li>You get 3 Logo Designs as per your briefing &amp; fine tune the one you select.</li>
                    <li>
                      A Detailed Branding portfolio on fonts, colors &amp; typography perfect for
                      long-term workability.
                    </li>
                    <li>
                      We design 3 Stationary designs for your brand like Letter Heads, Visiting
                      Cards &amp; policy envelopes.
                    </li>
                    <li>
                      We design a brochure or your company&apos;s profile to send it across to your
                      targeted audience (Max: 15 Pages).
                    </li>
                    <li>
                      Print media consultation for getting your stationary and profile printed with
                      the best possible quality.
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}

            {activePackageTab === 'website' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Essentials</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Number of pages: 4</li>
                    <li>Google Site Kit</li>
                    <li>Write Copy Content: up to 1000 words</li>
                    <li>Setting up Domain &amp; Hosting</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$799</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Number of pages: 6</li>
                    <li>Google Site Kit</li>
                    <li>Write Copy Content: up to 2000 words</li>
                    <li>Setting up Domain &amp; Hosting</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Number of pages: 10</li>
                    <li>Google Site Kit</li>
                    <li>Write Copy Content: up to 3000 words</li>
                    <li>Setting up Domain &amp; Hosting</li>
                    <li>On-site SEO for Content and Tags</li>
                    <li>Blog Uploads</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Number of pages: 14</li>
                    <li>Google Site Kit</li>
                    <li>Write Copy Content: up to 4000 words</li>
                    <li>Setting up Domain &amp; Hosting</li>
                    <li>On-site SEO for Content and Tags</li>
                    <li>Blog Uploads</li>
                    <li>Custom UI/UX Designs</li>
                    <li>Plugin Integration</li>
                    <li>Revisions</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}

            {activePackageTab === 'app' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Essentials</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We develop your app according to your UI/UX.</li>
                    <li>We optimize your app for various devices and screens.</li>
                    <li>
                      API Integration refers to the connection of 3rd party services (Up to 1
                      Integrations).
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$2999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We develop your app according to your UI/UX.</li>
                    <li>We optimize your app for various devices and screens.</li>
                    <li>
                      API Integration refers to the connection of 3rd party services (Up to 2
                      Integrations).
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$3499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We develop your app according to your UI/UX.</li>
                    <li>We optimize your app for various devices and screens.</li>
                    <li>
                      API Integration refers to the connection of 3rd party services (Up to 3
                      Integrations).
                    </li>
                    <li>We help you launch your app on the iOS &amp; Android App Store.</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$4999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>We develop your app according to your UI/UX.</li>
                    <li>We optimize your app for various devices and screens.</li>
                    <li>
                      API Integration refers to the connection of 3rd party services (Up to 4
                      Integrations).
                    </li>
                    <li>We help you launch your app on the iOS &amp; Android App Store.</li>
                    <li>We upload your app on the iOS &amp; Play Store.</li>
                    <li>
                      We make your app compliant with data collection regulations in various
                      countries.
                    </li>
                    <li>
                      We redirect the servers after the app has been uploaded to the store.
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}

            {activePackageTab === 'uiux' && (
              <div className="packages-grid">
                <div className="package-card">
                  <h3 className="package-name">Essentials</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$599</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>
                      We research your product with constant sessions with you to learn more about
                      your final product.
                    </li>
                    <li>
                      We wireframe your product to understand how the connection flow is going to
                      look like.
                    </li>
                    <li>
                      We work on making the user experience of your product more adaptive.
                    </li>
                    <li>
                      We design the user interface of your product to make it aesthetically
                      pleasing.
                    </li>
                    <li>
                      We provide you with a working prototype of your product to give you an idea of
                      its functionality (Up to 55 Screens).
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>
                      We research your product with constant sessions with you to learn more about
                      your final product.
                    </li>
                    <li>
                      We wireframe your product to understand how the connection flow is going to
                      look like.
                    </li>
                    <li>
                      We work on making the user experience of your product more adaptive.
                    </li>
                    <li>
                      We design the user interface of your product to make it aesthetically
                      pleasing.
                    </li>
                    <li>
                      We provide you with a working prototype of your product to give you an idea of
                      its functionality (Up to 75 Screens).
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>
                      We research your product with constant sessions with you to learn more about
                      your final product.
                    </li>
                    <li>
                      We wireframe your product to understand how the connection flow is going to
                      look like.
                    </li>
                    <li>
                      We work on making the user experience of your product more adaptive.
                    </li>
                    <li>
                      We design the user interface of your product to make it aesthetically
                      pleasing.
                    </li>
                    <li>
                      We provide you with a working prototype of your product to give you an idea of
                      its functionality (Up to 95 Screens).
                    </li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Free Trail Insights Art Plan
                    <br />
                    Ideal for beginner artists.
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$2499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>
                      We research your product with constant sessions with you to learn more about
                      your final product.
                    </li>
                    <li>
                      We wireframe your product to understand how the connection flow is going to
                      look like.
                    </li>
                    <li>
                      We work on making the user experience of your product more adaptive.
                    </li>
                    <li>
                      We design the user interface of your product to make it aesthetically
                      pleasing.
                    </li>
                    <li>
                      We provide you with a working prototype of your product to give you an idea of
                      its functionality (Up to 135 Screens).
                    </li>
                    <li>We test the UI with various target audiences to ensure usability.</li>
                    <li>We analyze your product and prepare an in-depth product analysis.</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>
              </div>
            )}
          </section>
        )}

        {!showCheckout && !showThankYou && activeSection === 'account' && (
          <section className="card account-card">
            <div className="account-tabs">
              <button
                type="button"
                className={`account-tab ${
                  activeAccountTab === 'subscription' ? 'active' : ''
                }`}
                onClick={() => setActiveAccountTab('subscription')}
              >
                Subscription
              </button>
              <button
                type="button"
                className={`account-tab ${
                  activeAccountTab === 'details' ? 'active' : ''
                }`}
                onClick={() => setActiveAccountTab('details')}
              >
                Account Details
              </button>
              <button
                type="button"
                className={`account-tab ${
                  activeAccountTab === 'logout' ? 'active' : ''
                }`}
                onClick={() => setActiveAccountTab('logout')}
              >
                Logout
              </button>
            </div>

            {activeAccountTab === 'subscription' && (
              <div className="account-table-wrapper">
                <table className="account-table">
                  <thead>
                    <tr>
                      <th>Subscription ˇ</th>
                      <th>Status ˇ</th>
                      <th>Next payment ˇ</th>
                      <th>Total ˇ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Revenue Rocket</td>
                      <td>On hold</td>
                      <td>-</td>
                      <td>$349.00</td>
                    </tr>
                    <tr>
                      <td>Revenue Rocket</td>
                      <td>trash</td>
                      <td>-</td>
                      <td>$349.00 / month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeAccountTab === 'details' && (
              <div className="account-details">
                <div className="account-avatar-section">
                  <div className="account-avatar-circle">
                    <img
                      src="/images/profile.png"
                      alt="Profile"
                      className="account-avatar-img"
                    />
                  </div>
                  <div className="account-avatar-actions">
                    <button type="button" className="account-avatar-btn secondary">
                      Remove Photo
                    </button>
                    <button type="button" className="account-avatar-btn primary">
                      Change Photo
                    </button>
                  </div>
                </div>

                <form className="account-form">
                  <div className="account-form-row">
                    <div className="account-field">
                      <label>
                        First name <span className="required">*</span>
                      </label>
                      <input type="text" placeholder="Placeholder" />
                    </div>
                    <div className="account-field">
                      <label>
                        Last name <span className="required">*</span>
                      </label>
                      <input type="text" placeholder="Placeholder" />
                    </div>
                  </div>

                  <div className="account-form-row">
                    <div className="account-field">
                      <label>
                        Display name <span className="required">*</span>
                      </label>
                      <input type="text" placeholder="Placeholder" />
                    </div>
                    <div className="account-field">
                      <label>
                        Email address <span className="required">*</span>
                      </label>
                      <input type="email" placeholder="Placeholder" />
                    </div>
                  </div>

                  <div className="account-section-heading">Password change</div>

                  <div className="account-field full">
                    <label>Current password (leave blank to leave unchanged)</label>
                    <input type="password" placeholder="Placeholder" />
                  </div>

                  <div className="account-field full">
                    <label>New password (leave blank to leave unchanged)</label>
                    <input type="password" placeholder="Placeholder" />
                  </div>

                  <div className="account-field full">
                    <label>Confirm new password</label>
                    <input type="password" placeholder="Placeholder" />
                  </div>

                  <div className="account-form-actions">
                    <button type="button" className="account-form-btn secondary">
                      Cancel
                    </button>
                    <button type="submit" className="account-form-btn primary">
                      Save Edits
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeAccountTab === 'logout' && (
              <div className="logout-panel">
                <div className="logout-icon-circle">
                  <span className="logout-icon-mark">!</span>
                </div>
                <h2 className="logout-title">Log Out</h2>
                <p className="logout-text">
                  Are you sure you would like to log out of your
                  <br />
                  AI Mark Labs account?
                </p>
                <div className="logout-actions">
                  <button type="button" className="logout-btn secondary">
                    Cancel
                  </button>
                  <button type="button" className="logout-btn primary">
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      {isCartOpen && !showCheckout && !showThankYou && (
        <div className="cart-overlay">
          <div
            className="cart-backdrop"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="cart-panel">
            <div className="cart-panel-header">
              <h2>Cart</h2>
              <button
                type="button"
                className="cart-close"
                onClick={() => setIsCartOpen(false)}
              >
                ×
              </button>
            </div>
            <p className="cart-greeting">
              Good afternoon BOB! You have 4 pending orders.
            </p>

            <div className="cart-items">
              <div className="cart-item">
                <div>
                  <div className="cart-item-title">Revenue Rocket</div>
                  <div className="cart-item-subtitle">
                    Free Trail Insights Art Plan Ideal for beginner artists.
                  </div>
                </div>
                <button type="button" className="cart-item-remove">
                  🗑 Remove
                </button>
              </div>

              <div className="cart-item">
                <div>
                  <div className="cart-item-title">Revenue Rocket</div>
                  <div className="cart-item-subtitle">
                    Free Trail Insights Art Plan Ideal for beginner artists.
                  </div>
                </div>
                <button type="button" className="cart-item-remove">
                  🗑 Remove
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>SUBTOTAL</span>
                <span>$696.69</span>
              </div>
              <div className="cart-summary-row">
                <span>ESTIMATED SALES TAX</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="cart-total">
              <span>TOTAL</span>
              <span className="cart-total-amount">$696.69 USD</span>
            </div>

            <button
              type="button"
              className="cart-checkout"
              onClick={() => {
                setIsCartOpen(false);
                setShowCheckout(true);
              }}
            >
              Check Out
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
