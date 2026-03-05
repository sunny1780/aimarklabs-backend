import React from 'react';

type AnalyticsTab =
  | 'monthly'
  | 'siteHealth'
  | 'webTraffic'
  | 'metaAnalytics'
  | 'googleAds'
  | 'googleBusiness';

interface AnalyticsSectionProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      <section className="tab-row">
        <button
          className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => onTabChange('monthly')}
        >
          Monthly Plan
        </button>
        <button
          className={`tab ${activeTab === 'siteHealth' ? 'active' : ''}`}
          onClick={() => onTabChange('siteHealth')}
        >
          Site Health
        </button>
        <button
          className={`tab ${activeTab === 'webTraffic' ? 'active' : ''}`}
          onClick={() => onTabChange('webTraffic')}
        >
          Web Traffic
        </button>
        <button
          className={`tab ${activeTab === 'metaAnalytics' ? 'active' : ''}`}
          onClick={() => onTabChange('metaAnalytics')}
        >
          Meta Analytics
        </button>
        <button
          className={`tab ${activeTab === 'googleAds' ? 'active' : ''}`}
          onClick={() => onTabChange('googleAds')}
        >
          Google Ads
        </button>
        <button
          className={`tab ${activeTab === 'googleBusiness' ? 'active' : ''}`}
          onClick={() => onTabChange('googleBusiness')}
        >
          Google business
        </button>
      </section>

      {activeTab === 'monthly' && (
        <section className="card">
          {/* existing Monthly content kept as-is */}
        </section>
      )}

      {/* TODO: move the rest of the tab-specific sections here if you want complete separation */}
    </>
  );
};

export default AnalyticsSection;


