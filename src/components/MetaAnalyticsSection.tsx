import React, { useState, useEffect, useCallback } from 'react';
import { fetchMetricoolData, MetricoolData, MetricoolPost } from '../services/metricoolService';
import '../App.css';

interface MetaAnalyticsSectionProps {
  clientName?: string;
  brandLabel?: string;
  metaAdsReportUrl?: string;
}

const MetaAnalyticsSection: React.FC<MetaAnalyticsSectionProps> = ({
  clientName = 'Little Sicily',
  brandLabel = 'Little Sicily',
  metaAdsReportUrl = 'https://lookerstudio.google.com/embed/reporting/a92fbd55-ba1d-496d-a97d-ac8f8cb0a2ce/page/p_afos27a1oc',
}) => {
  const [data, setData] = useState<MetricoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePostTab, setActivePostTab] = useState<'engagements' | 'clicks' | 'impressions'>('engagements');
  const [dateRange] = useState({ start: '2025-11-11', end: '2025-12-10' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMetricoolData(dateRange.start, dateRange.end);
      setData(result);
    } catch (err) {
      setError('Failed to load Metricool data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getSortedPosts = (): MetricoolPost[] => {
    if (!data) return [];
    const posts = [...data.posts];
    switch (activePostTab) {
      case 'engagements':
        return posts.sort((a, b) => b.engagement - a.engagement);
      case 'clicks':
        return posts.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'impressions':
        return posts.sort((a, b) => b.impressions - a.impressions);
      default:
        return posts;
    }
  };

  if (loading) {
    return (
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">{`Meta Analytics For ${clientName}`}</h2>
          <p className="card-subtitle">Loading data from Metricool...</p>
        </header>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">{`Meta Analytics For ${clientName}`}</h2>
          <p className="card-subtitle">
            In February, we&apos;ll enhance online presence, improve website
            functionality, connect with customers through Valentine&apos;s Day
            promotions on social media, and run targeted ads focused on the
            Beckley area.
          </p>
        </header>
        <div className="meta-layout">
          <div className="meta-error center">
            <span className="meta-error-icon">⚠️</span>
            <div className="meta-error-text">
              {error || 'Unable to connect to Metricool. Please check your API configuration.'}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const sortedPosts = getSortedPosts();
  const isMockData = data.source === 'mock';
  const instagramPosts = data.posts.filter((p) => p.platform === 'instagram');
  const facebookPosts = data.posts.filter((p) => p.platform === 'facebook');
  const instagramLikes = instagramPosts.reduce((sum, post) => sum + post.likes, 0);
  const instagramComments = instagramPosts.reduce((sum, post) => sum + post.comments, 0);
  const totalImpressions = data.posts.reduce((sum, post) => sum + post.impressions, 0);
  const instagramImpressions = instagramPosts.reduce((sum, post) => sum + post.impressions, 0);
  const facebookImpressions = facebookPosts.reduce((sum, post) => sum + post.impressions, 0);
  const getMetricValue = (
    names: string[],
    platform?: 'instagram' | 'facebook',
    fallback = 0
  ): number => {
    const metric = data.metrics.find(
      (m) => names.includes(m.name) && (!platform || m.platform === platform)
    );
    return metric ? metric.value : fallback;
  };
  const instagramPostCount = instagramPosts.length;
  const totalDays = Math.max(
    1,
    Math.ceil(
      (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
  const communityMetrics = [
    {
      label: 'Followers',
      value: getMetricValue(['Followers', 'Total Followers'], 'instagram'),
    },
    {
      label: 'Following',
      value: getMetricValue(['Following'], 'instagram'),
    },
    {
      label: 'Total content',
      value: getMetricValue(
        ['Total Content', 'Total Posts'],
        'instagram',
        instagramPostCount
      ),
    },
  ];
  const accountMetrics = [
    {
      label: 'Views',
      value: getMetricValue(['Views', 'Profile Views'], 'instagram', totalImpressions),
    },
    {
      label: 'Avg reach per day',
      value: getMetricValue(
        ['Avg Reach Per Day', 'Average Reach'],
        'instagram',
        Math.round(instagramImpressions / totalDays)
      ),
    },
    {
      label: 'Total content',
      value: communityMetrics[2].value,
    },
  ];

  return (
    <section className="card">
      <header className="card-header">
        <h2 className="card-title">{`Meta Analytics For ${clientName}`}</h2>
        <p className="card-subtitle">
          In February, we&apos;ll enhance online presence, improve website
          functionality, connect with customers through Valentine&apos;s Day
          promotions on social media, and run targeted ads focused on the
          Beckley area.
        </p>
      </header>

      {isMockData && (
        <div className="meta-warning">
          <strong>Demo data:</strong> Unable to reach Metricool. Showing placeholder stats until you provide valid API credentials.
        </div>
      )}

      <div className="meta-layout">
        <section className="meta-section">
          <h3 className="meta-section-heading">Meta Analytics</h3>

          <div className="meta-panel meta-panel--top">
            <div className="meta-header-row">
              <div className="meta-brand">
                <span className="meta-brand-icon">{brandLabel}</span>
                <span className="meta-brand-title">Meta Analytics</span>
              </div>
              <button className="meta-date">
                {formatDateRange(dateRange.start, dateRange.end)} ▾
              </button>
            </div>

            <div className="meta-metric-group">
              <div className="meta-metric-group-title">Community</div>
              <div className="meta-top-grid">
                {communityMetrics.map((metric, idx) => (
                  <div key={`community-${idx}`} className="meta-card small">
                    <div style={{ padding: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {formatNumber(metric.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="meta-metric-group">
              <div className="meta-metric-group-title">Account</div>
              <div className="meta-top-grid">
                {accountMetrics.map((metric, idx) => (
                  <div key={`account-${idx}`} className="meta-card small">
                    <div style={{ padding: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {formatNumber(metric.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="meta-bottom-grid">
              <div className="meta-subsection">
                <h4 className="meta-subsection-title">Split by actions</h4>
                <div className="meta-card">
                  <div style={{ padding: '12px', fontSize: '12px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 600 }}>Instagram Actions</div>
                    <div style={{ color: '#6b7280', marginBottom: '4px' }}>
                      Likes: {formatNumber(instagramLikes)}
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      Comments: {formatNumber(instagramComments)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="meta-subsection">
                <h4 className="meta-subsection-title">
                  Organic impressions
                  <span className="meta-subsection-note">
                    (All impressions recorded under post&apos;s creation date)
                  </span>
                </h4>
                <div className="meta-card">
                  <div style={{ padding: '12px', fontSize: '12px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 600 }}>
                      Total: {formatNumber(totalImpressions)}
                    </div>
                    <div style={{ color: '#6b7280', marginBottom: '4px' }}>
                      Instagram: {formatNumber(instagramImpressions)}
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      Facebook: {formatNumber(facebookImpressions)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="meta-section meta-section--post">
          <h3 className="meta-section-heading">Post performance</h3>

          <div className="meta-panel meta-panel--top">
            <div className="meta-header-row">
              <div className="meta-brand">
                <span className="meta-brand-icon">{brandLabel}</span>
                <span className="meta-brand-title">Post performance</span>
              </div>
              <button className="meta-date">
                {formatDateRange(dateRange.start, dateRange.end)} ▾
              </button>
            </div>

            <div className="meta-tabs-row">
              <button
                className={`meta-mini-tab ${activePostTab === 'engagements' ? 'active' : ''}`}
                onClick={() => setActivePostTab('engagements')}
              >
                Engagements
              </button>
              <button
                className={`meta-mini-tab ${activePostTab === 'clicks' ? 'active' : ''}`}
                onClick={() => setActivePostTab('clicks')}
              >
                Clicks
              </button>
              <button
                className={`meta-mini-tab ${activePostTab === 'impressions' ? 'active' : ''}`}
                onClick={() => setActivePostTab('impressions')}
              >
                Impressions
              </button>
            </div>

            <div className="meta-subsection">
              <h4 className="meta-subsection-title">Performance by Posts</h4>
              <div className="meta-card meta-card--large">
                <div style={{ padding: '16px' }}>
                  {sortedPosts.length === 0 ? (
                    <div className="meta-error center">
                      <span className="meta-error-icon">📊</span>
                      <div className="meta-error-text">
                        No posts found for the selected date range.
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {sortedPosts.map((post) => (
                        <div
                          key={post.id}
                          style={{
                            padding: '12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: post.platform === 'instagram' ? '#E4405F' : '#1877F2' }}>
                                {post.platform}
                              </div>
                              <div style={{ fontSize: '12px', color: '#111827', marginTop: '4px' }}>
                                {post.caption.substring(0, 60)}...
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#6b7280' }}>
                            <span>❤️ {formatNumber(post.likes)}</span>
                            <span>💬 {formatNumber(post.comments)}</span>
                            {typeof post.clicks === 'number' && <span>🖱️ {formatNumber(post.clicks)}</span>}
                            {post.shares && <span>🔗 {formatNumber(post.shares)}</span>}
                            <span>👁️ {formatNumber(post.impressions)}</span>
                            <span>📈 {formatNumber(post.engagement)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="meta-section meta-section--ads">
          <h3 className="meta-section-heading">Facebook Ads</h3>

          <div className="meta-panel meta-panel--ads">
            <div className="meta-header-row">
              <div className="meta-brand">
                <span className="meta-brand-icon">{brandLabel}</span>
                <span className="meta-brand-title">Overview Report</span>
              </div>
              <button className="meta-date">Facebook Ads Report</button>
            </div>

            <div className="meta-metric-group">
              <div className="meta-metric-group-title">{`${clientName} Facebook Ads Dashboard`}</div>
              <div className="meta-card meta-card--large" style={{ padding: '0', overflow: 'hidden' }}>
                <iframe
                  title={`${clientName} Facebook Ads Report`}
                  src={metaAdsReportUrl}
                  width="100%"
                  height="900"
                  style={{ border: 0 }}
                  frameBorder={0}
                  allowFullScreen
                  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default MetaAnalyticsSection;
