import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildApiUrl } from '../utils/api';

type SiteHealthOverviewProps = {
  clientSlug: string;
  brandLabel: string;
};

type MetricAudit = {
  id: string;
  title: string;
  displayValue: string;
  numericValue: number;
  score: number | null;
};

type Opportunity = {
  id: string;
  title: string;
  displayValue: string;
  savingsMs: number;
};

type StrategyData = {
  strategy: 'mobile' | 'desktop';
  lighthouse: {
    scores: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
    metrics: {
      firstContentfulPaint: MetricAudit;
      largestContentfulPaint: MetricAudit;
      speedIndex: MetricAudit;
      totalBlockingTime: MetricAudit;
      interactionToNextPaint: MetricAudit;
      cumulativeLayoutShift: MetricAudit;
    };
    topOpportunities: Opportunity[];
  };
  fieldData: {
    coreWebVitals: {
      lcp: { displayValue: string; category: string };
      inp: { displayValue: string; category: string };
      cls: { displayValue: string; category: string };
    };
  };
};

type SiteHealthResponse = {
  url: string;
  fetchedAt: string;
  strategies: Partial<Record<'mobile' | 'desktop', StrategyData>>;
};

const STORAGE_PREFIX = 'site-health-overview';
const STORAGE_MAX_AGE_MS = 5 * 60 * 1000;

const compactMs = (value: number): string =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;

const compactMetricValue = (value: number, id: string): string => {
  if (!value) return '-';
  if (id === 'cumulative-layout-shift') return value.toFixed(3);
  return compactMs(value);
};

const metricTone = (score: number | null): 'good' | 'warn' => {
  if (score === null) return 'warn';
  return score >= 0.9 ? 'good' : 'warn';
};

const ScoreRing: React.FC<{
  value: number;
  tone: 'good' | 'warning' | 'bad';
}> = ({ value, tone }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedValue(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const size = 58;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, animatedValue));
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`site-health-score-circle ${tone}`}>
      <svg
        className="site-health-score-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          className="site-health-score-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="site-health-score-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="site-health-score-value">{value}</span>
    </div>
  );
};

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const readStorage = (key: string): SiteHealthResponse | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; data: SiteHealthResponse };
    if (!parsed?.at || !parsed?.data) return null;
    if (Date.now() - parsed.at > STORAGE_MAX_AGE_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, data: SiteHealthResponse) => {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore */
  }
};

const SiteHealthOverview: React.FC<SiteHealthOverviewProps> = ({
  clientSlug,
  brandLabel,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SiteHealthResponse | null>(null);

  const storageKey = useMemo(
    () => `${STORAGE_PREFIX}:${clientSlug}`,
    [clientSlug]
  );

  const fetchData = useCallback(async (force = false) => {
    setError(null);
    const cached = force ? null : readStorage(storageKey);
    if (cached && !force) {
      setData(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const url = new URL(buildApiUrl('/api/site-health/overview'));
      url.searchParams.set('client', clientSlug);
      if (force) {
        url.searchParams.set('force', '1');
        url.searchParams.set('t', Date.now().toString());
      }
      const response = await fetch(url.toString());
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || `Request failed (${response.status}).`);
      }
      setData(payload);
      writeStorage(storageKey, payload);
    } catch (fetchError) {
      const isNetworkError =
        fetchError instanceof TypeError && fetchError.message === 'Failed to fetch';
      const message = isNetworkError
        ? 'Backend API is not reachable. Start it with: npm run start:api'
        : fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load site health report.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientSlug, storageKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="site-health-live">
        <div className="site-health-live-state">Loading site health report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-health-live">
        <div className="site-health-live-state site-health-live-error">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="site-health-live">
        <div className="site-health-live-state">No site health data found.</div>
      </div>
    );
  }

  const strategies: Array<'mobile' | 'desktop'> = ['mobile', 'desktop'];

  return (
    <div className="site-health-live">
      <div className="site-health-live-header">
        <div>
          <div className="site-health-live-brand">{brandLabel}</div>
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="site-health-live-url"
          >
            {data.url}
          </a>
        </div>
        <button
          type="button"
          className="site-health-live-refresh"
          onClick={() => fetchData(true)}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="site-health-live-meta">
        Last updated: {formatDateTime(data.fetchedAt)}
      </div>

      <div className="site-health-live-grid">
        {strategies.map((strategy) => {
          const item = data.strategies[strategy];
          if (!item) {
            return (
              <section key={strategy} className="site-health-live-card">
                <h3>{strategy.toUpperCase()}</h3>
                <p>No data available for this strategy.</p>
              </section>
            );
          }

          const scores = item.lighthouse.scores;
          const lab = item.lighthouse.metrics;
          const metricsPanel = [
            {
              label: 'First Contentful Paint',
              value: compactMetricValue(
                lab.firstContentfulPaint.numericValue,
                lab.firstContentfulPaint.id
              ),
              tone: metricTone(lab.firstContentfulPaint.score),
            },
            {
              label: 'Largest Contentful Paint',
              value: compactMetricValue(
                lab.largestContentfulPaint.numericValue,
                lab.largestContentfulPaint.id
              ),
              tone: metricTone(lab.largestContentfulPaint.score),
            },
            {
              label: 'Total Blocking Time',
              value: compactMetricValue(
                lab.totalBlockingTime.numericValue,
                lab.totalBlockingTime.id
              ),
              tone: metricTone(lab.totalBlockingTime.score),
            },
            {
              label: 'Cumulative Layout Shift',
              value: compactMetricValue(
                lab.cumulativeLayoutShift.numericValue,
                lab.cumulativeLayoutShift.id
              ),
              tone: metricTone(lab.cumulativeLayoutShift.score),
            },
            {
              label: 'Speed Index',
              value: compactMetricValue(
                lab.speedIndex.numericValue,
                lab.speedIndex.id
              ),
              tone: metricTone(lab.speedIndex.score),
            },
          ];

          return (
            <section key={strategy} className="site-health-live-card">
              <h3>{strategy.toUpperCase()}</h3>
              <div className="site-health-score-row">
                {[
                  { label: 'Performance', value: scores.performance },
                  { label: 'Accessibility', value: scores.accessibility },
                  { label: 'Best Practices', value: scores.bestPractices },
                  { label: 'SEO', value: scores.seo },
                ].map((scoreItem) => {
                  const tone =
                    scoreItem.value >= 90
                      ? 'good'
                      : scoreItem.value >= 50
                        ? 'warning'
                        : 'bad';
                  return (
                    <div key={scoreItem.label} className="site-health-score-item">
                      <ScoreRing value={scoreItem.value} tone={tone} />
                      <div className="site-health-score-label">{scoreItem.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="site-health-metrics-panel">
                <div className="site-health-metrics-title">METRICS</div>
                <div className="site-health-metrics-grid">
                  {metricsPanel.map((metric) => (
                    <div key={metric.label} className="site-health-metric-item">
                      <div className="site-health-metric-label-row">
                        <span
                          className={`site-health-metric-icon ${metric.tone}`}
                          aria-hidden="true"
                        >
                          {metric.tone === 'good' ? '●' : '▲'}
                        </span>
                        <span className="site-health-metric-label">{metric.label}</span>
                      </div>
                      <div className={`site-health-metric-value ${metric.tone}`}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          );
        })}
      </div>
    </div>
  );
};

export default SiteHealthOverview;
