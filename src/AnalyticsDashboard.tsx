import React, { useMemo, useState } from 'react';
import './App.css';
import FacebookAdsOverview from './components/FacebookAdsOverview';
import MetaAnalyticsSection from './components/MetaAnalyticsSection';
import InstagramOverview from './components/InstagramOverview';
import SiteHealthOverview from './components/SiteHealthOverview';
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
      'https://docs.google.com/document/d/1dBS41EjruxDPe64a8aQX-B2XGh1Uq4Mg18kwU6CT5kA/preview',
    auditReportDownloadUrl:
      'https://docs.google.com/document/d/1dBS41EjruxDPe64a8aQX-B2XGh1Uq4Mg18kwU6CT5kA/export?format=pdf',
    hasAnalyticsData: true,
    showAuditPreview: true,
  },
  'party-hall': {
    name: 'Beckley Party Hall',
    brandLabel: 'Beckley Party Hall',
    webTrafficEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/3037419a-81b3-4c0e-8d17-1a319bbee0bd/page/OAikE',
    metaAdsEmbedUrl: '',
    auditReportPreviewUrl:
      '/images/Karachi-BBQ-Tonight-Digital-Marketing-Audit.pdf',
    auditReportDownloadUrl:
      '/images/Karachi-BBQ-Tonight-Digital-Marketing-Audit.pdf',
    hasAnalyticsData: true,
    showAuditPreview: false,
  },
  'walker-advisor': {
    name: 'Walker Advisor',
    brandLabel: 'Walker Advisor',
    webTrafficEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/35566fb0-1a0a-4bb8-861a-7df8c3985bed/page/DsIlE',
    metaAdsEmbedUrl:
      'https://lookerstudio.google.com/embed/reporting/c7f66e46-e89f-4879-a554-9087add5ea56/page/p_afos27a1oc',
    auditReportPreviewUrl:
      'https://docs.google.com/document/d/1HWkfC6xnBIT6SF-jYRYRq6t9DWS_KhpI/preview',
    auditReportDownloadUrl:
      'https://docs.google.com/document/d/1HWkfC6xnBIT6SF-jYRYRq6t9DWS_KhpI/export?format=pdf',
    hasAnalyticsData: true,
    showAuditPreview: true,
  },
};
const GOOGLE_ANALYTICS_EMBED_URL =
  'https://lookerstudio.google.com/embed/reporting/74a8d7cb-48db-439e-9f23-2224d1651b82/page/1h0pF';

const AnalyticsDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'analytics' | 'audit' | 'packages' | 'account'
  >('analytics');
  const [activeTab, setActiveTab] = useState<
    | 'monthly'
    | 'siteHealth'
    | 'webTraffic'
    | 'metaAnalytics'
    | 'googleAnalytics'
    | 'googleAds'
    | 'googleBusiness'
  >('monthly');
  const [activePackageTab, setActivePackageTab] = useState<
    'everything' | 'reputation' | 'branding' | 'website' | 'app' | 'uiux'
  >('everything');
  const [activeAccountTab, setActiveAccountTab] = useState<
    'subscription' | 'details' | 'logout'
  >('subscription');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const activeClientSlug = useMemo(() => {
    if (typeof window === 'undefined') return 'little-sicily';
    return localStorage.getItem('dashboard_active_client_slug') || 'little-sicily';
  }, []);
  const activeClient = useMemo(() => {
    return DASHBOARD_CLIENTS[activeClientSlug] || DASHBOARD_CLIENTS['little-sicily'];
  }, [activeClientSlug]);
  const isAuditPdf = activeClient.auditReportPreviewUrl
    .toLowerCase()
    .includes('.pdf');
  const auditPdfPreviewUrl = isAuditPdf
    ? `${activeClient.auditReportPreviewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : activeClient.auditReportPreviewUrl;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard_active_client_slug');
      localStorage.removeItem('dashboard_active_email');
      window.location.href = '/login';
    }
  };

  return (
    <div className="analytics-app">
      <Sidebar
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onLogout={handleLogout}
      />

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
                      {/* Free Trail Insights Art Plan Ideal for beginner artists. */}
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
                      {/* Free Trail Insights Art Plan Ideal for beginner artists. */}
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
            className={`tab ${activeTab === 'googleAnalytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('googleAnalytics')}
          >
            Google Analytics
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
            <section className="card" style={{ marginBottom: '12px', padding: '14px 16px', background: '#f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <h2 className="card-title" style={{ marginBottom: '8px' }}>
                    Your Digital Growth Strategy
                  </h2>
                  <p className="card-subtitle" style={{ margin: 0 }}>
                    Our ongoing strategy focuses on strengthening your online presence, maximizing website
                    performance, building customer engagement through social media, and delivering targeted
                    advertising to reach the right audience.
                  </p>
                </div>
              </div>
            </section>
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
              <h2 className="card-title">Site Health Overview</h2>
              <p className="card-subtitle">
                We continuously monitor and improve your website&apos;s performance,
                fix technical issues, enhance user experience, and ensure your
                site is fully optimized to attract and convert visitors.
              </p>
            </header>
            <SiteHealthOverview
              clientSlug={activeClientSlug}
              brandLabel={activeClient.brandLabel}
            />
          </section>
        )}

        {activeTab === 'webTraffic' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">Web Traffic &amp; Online Visibility</h2>
              <p className="card-subtitle">
                We continuously analyze and improve your website traffic, optimize
                search rankings, expand your online reach, and implement data-driven
                strategies to attract more visitors and grow your audience.
              </p>
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

        {activeTab === 'metaAnalytics' &&
          (activeClientSlug === 'walker-advisor' ? (
            <>
              <FacebookAdsOverview clientName={activeClient.name} />
              <div style={{ marginTop: '12px' }}>
                <InstagramOverview
                  clientName={activeClient.name}
                  clientSlug={activeClientSlug}
                />
              </div>
            </>
          ) : activeClientSlug === 'party-hall' ? (
            <InstagramOverview
              clientName={activeClient.name}
              clientSlug={activeClientSlug}
            />
          ) : (
            <MetaAnalyticsSection
              clientName={activeClient.name}
              brandLabel={activeClient.brandLabel}
              metaAdsReportUrl={activeClient.metaAdsEmbedUrl}
            />
          ))}

        {activeTab === 'googleAnalytics' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">Google Analytics &amp; Website Insights</h2>
              <p className="card-subtitle">
                We monitor website traffic, audience behavior, engagement patterns,
                and conversion trends to uncover what is working and where to improve.
              </p>
            </header>

            <div className="web-traffic-layout">
              <iframe
                title="Google Analytics Looker Studio"
                src={GOOGLE_ANALYTICS_EMBED_URL}
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

        {activeTab === 'googleAds' && (
          <section className="card">
            <header className="card-header">
              <h2 className="card-title">Google Ads &amp; Paid Performance</h2>
              <p className="card-subtitle">
                We continuously manage and optimize your Google Ad campaigns, target
                the right audience, monitor spend efficiency, and refine strategies
                to maximize clicks, conversions, and return on your ad investment.
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
              <h2 className="card-title">Google Business Profile &amp; Local Presence</h2>
              <p className="card-subtitle">
                Your Google Business Profile is often the first impression
                customers get. We keep it sharp, accurate, and active - so when
                someone finds you, they have every reason to choose you.
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    Professional Business Website
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Professional Business Website</li>
                    <li>Core UI/UX Design</li>
                    <li>Domain &amp; Hosting Setup</li>
                    <li>Foundational SEO</li>
                    <li>Basic Keyword Research</li>
                    <li>Analytics Integration</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Foundation</h3>
                  <p className="package-subtitle">
                    Professional Business Website
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$799</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Professional Business Website</li>
                    <li>Enhanced UI/UX Design</li>
                    <li>Domain &amp; Hosting Setup</li>
                    <li>Foundational SEO</li>
                    <li>Strategic Keyword Research</li>
                    <li>Advanced On-Page SEO</li>
                    <li>Competitor Analysis</li>
                    <li>Lead Capture System</li>
                    <li>Analytics &amp; Tracking Setup</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Evolution</h3>
                  <p className="package-subtitle">
                    Professional Business Website
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$999</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Professional Business Website</li>
                    <li>Conversion-Focused UI/UX</li>
                    <li>Domain &amp; Hosting Optimization</li>
                    <li>Complete SEO Strategy</li>
                    <li>Advanced Keyword Mapping</li>
                    <li>Technical SEO Optimization</li>
                    <li>Competitor &amp; Market Analysis</li>
                    <li>Lead Generation System</li>
                    <li>Local SEO Setup</li>
                    <li>Conversion Tracking</li>
                    <li>Monthly Performance Review</li>
                  </ul>
                  <button className="package-button">Add To Cart</button>
                </div>

                <div className="package-card">
                  <h3 className="package-name">Luxe</h3>
                  <p className="package-subtitle">
                    Fully Customized Business Website
                  </p>
                  <div className="package-price-row">
                    <span className="package-price">$1499</span>
                    <span className="package-period">per month</span>
                  </div>
                  <ul className="package-features">
                    <li>Fully Customized Business Website</li>
                    <li>Advanced Conversion UI/UX</li>
                    <li>Premium Hosting Optimization</li>
                    <li>Advanced SEO Execution &amp; Monitoring</li>
                    <li>Comprehensive Keyword Strategy</li>
                    <li>Technical &amp; Structured Data SEO</li>
                    <li>Market Expansion Strategy</li>
                    <li>CRM &amp; Automation Integration</li>
                    <li>Funnel &amp; Revenue Optimization</li>
                    <li>Advanced Analytics &amp; Reporting</li>
                    <li>Ongoing Growth Strategy</li>
                    <li>Priority Support</li>
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan */}
                    <br />
                    {/* Ideal for beginner artists. */}
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
                  <button
                    type="button"
                    className="logout-btn secondary"
                    onClick={() => setActiveAccountTab('subscription')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="logout-btn primary"
                    onClick={handleLogout}
                  >
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
                    {/* Free Trail Insights Art Plan Ideal for beginner artists. */}
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
                    {/* Free Trail Insights Art Plan Ideal for beginner artists. */}
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
