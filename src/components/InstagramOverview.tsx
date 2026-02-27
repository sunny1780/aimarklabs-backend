import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildApiUrl } from '../utils/api';

type InstagramOverviewProps = {
  clientName: string;
  clientSlug?: string;
};

type InstagramPostRow = {
  id: string;
  source: string;
  campaign: string;
  impressions: number;
  clicks: number;
  amountSpent: number;
  postEngagement: number;
};

type AccountSummary = {
  source: string;
  accountId: string;
  pageName?: string;
  impressions: number;
  postEngagement: number;
  pageEngagement: number;
  pageLikes: number;
  reach: number;
};

type DateRange = {
  since: string;
  until: string;
};

const toISODate = (value: Date): string => value.toISOString().slice(0, 10);

const getDefaultRange = (): DateRange => {
  const until = new Date();
  until.setDate(until.getDate() + 1);
  const since = new Date(until);
  since.setDate(until.getDate() - 7);
  return { since: toISODate(since), until: toISODate(until) };
};

const formatDateLabel = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const compactNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  if (value % 1 !== 0) return value.toFixed(1);
  return value.toString();
};

const money = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

const CACHE_KEY = 'ig-overview';
const cache = new Map<string, { postRows: InstagramPostRow[]; summaries: AccountSummary[] }>();
const STORAGE_KEY_PREFIX = 'ig-overview-storage';
const STORAGE_MAX_AGE_MS = 5 * 60 * 1000;

const getFromStorage = (since: string, until: string): { postRows: InstagramPostRow[]; summaries: AccountSummary[] } | null => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}:${since}:${until}`);
    if (!raw) return null;
    const { postRows, summaries, at } = JSON.parse(raw);
    if (Date.now() - at > STORAGE_MAX_AGE_MS) return null;
    return Array.isArray(postRows) && Array.isArray(summaries) ? { postRows, summaries } : null;
  } catch {
    return null;
  }
};

const setToStorage = (since: string, until: string, postRows: InstagramPostRow[], summaries: AccountSummary[]) => {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}:${since}:${until}`,
      JSON.stringify({ postRows, summaries, at: Date.now() })
    );
  } catch {
    /* ignore */
  }
};

const InstagramOverview: React.FC<InstagramOverviewProps> = ({
  clientName,
  clientSlug = 'party-hall',
}) => {
  const [dateRange] = useState<DateRange>(getDefaultRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postRows, setPostRows] = useState<InstagramPostRow[]>([]);
  const [summaries, setSummaries] = useState<AccountSummary[]>([]);

  const dateLabel = useMemo(
    () => `${formatDateLabel(dateRange.since)} - ${formatDateLabel(dateRange.until)}`,
    [dateRange.since, dateRange.until]
  );
  const overviewLabel =
    clientSlug === 'walker-advisor' ? 'INSTAGRAM' : 'FACEBOOK & INSTAGRAM';
  const hasInstagramUnavailableMetrics = useMemo(
    () =>
      postRows.some(
        (row) =>
          row.source === 'instagram' &&
          row.impressions === 0 &&
          row.amountSpent === 0
      ),
    [postRows]
  );

  const fetchData = useCallback(async () => {
    const cacheKey = `${CACHE_KEY}:${clientSlug}:${dateRange.since}:${dateRange.until}`;
    const memCached = cache.get(cacheKey);
    const storageCached = getFromStorage(
      `${clientSlug}:${dateRange.since}`,
      dateRange.until
    );

    if (memCached) {
      setPostRows(memCached.postRows);
      setSummaries(memCached.summaries);
      setLoading(false);
    } else if (storageCached) {
      setPostRows(storageCached.postRows);
      setSummaries(storageCached.summaries);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = new URL(buildApiUrl('/api/instagram/overview'));
      url.searchParams.set('client', clientSlug);
      url.searchParams.set('since', dateRange.since);
      url.searchParams.set('until', dateRange.until);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Backend API failed with status ${response.status}.`);
      }

      const fbPosts: InstagramPostRow[] = Array.isArray(data?.facebook?.posts) ? data.facebook.posts : [];
      const igPosts: InstagramPostRow[] = Array.isArray(data?.instagram?.posts) ? data.instagram.posts : [];
      const rows: InstagramPostRow[] = [...fbPosts, ...igPosts];

      const nextSummaries: AccountSummary[] = [];
      if (data?.facebook?.summary) {
        const s = data.facebook.summary;
        nextSummaries.push({
          source: s.source || 'facebook',
          accountId: s.accountId || '-',
          pageName: s.pageName,
          impressions: Number(s.impressions) || 0,
          postEngagement: Number(s.postEngagement) || 0,
          pageEngagement: Number(s.pageEngagement) || 0,
          pageLikes: Number(s.pageLikes) || 0,
          reach: Number(s.reach) || 0,
        });
      }
      if (data?.instagram?.summary) {
        const s = data.instagram.summary;
        nextSummaries.push({
          source: s.source || 'instagram',
          accountId: s.accountId || '-',
          impressions: Number(s.impressions) || 0,
          postEngagement: Number(s.postEngagement) || 0,
          pageEngagement: Number(s.pageEngagement) || 0,
          pageLikes: Number(s.pageLikes) || 0,
          reach: Number(s.reach) || 0,
        });
      }
      if (nextSummaries.length === 0 && data?.summary) {
        const s = data.summary;
        nextSummaries.push({
          source: s.source || 'instagram',
          accountId: s.accountId || '-',
          impressions: Number(s.impressions) || 0,
          postEngagement: Number(s.postEngagement) || 0,
          pageEngagement: Number(s.pageEngagement) || 0,
          pageLikes: Number(s.pageLikes) || 0,
          reach: Number(s.reach) || 0,
        });
      }

      cache.set(cacheKey, { postRows: rows, summaries: nextSummaries });
      setToStorage(
        `${clientSlug}:${dateRange.since}`,
        dateRange.until,
        rows,
        nextSummaries
      );
      setPostRows(rows);
      setSummaries(nextSummaries);
    } catch (fetchError) {
      setPostRows([]);
      setSummaries([]);
      const isNetworkError =
        fetchError instanceof TypeError && fetchError.message === 'Failed to fetch';
      const message = isNetworkError
        ? 'Backend API is not reachable. Start it with: npm run start:api'
        : fetchError instanceof Error
          ? fetchError.message
          : 'Failed to load Facebook & Instagram data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientSlug, dateRange.since, dateRange.until]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="fb-overview-card">
      <header className="fb-overview-header">
        <div className="fb-overview-title-wrap">
          <p className="fb-overview-kicker">
            {clientName.toUpperCase()} {overviewLabel}
          </p>
          <h2>Overview Report</h2>
        </div>
        <button type="button" className="fb-overview-date">
          {dateLabel}
        </button>
      </header>

      {loading && (
        <div className="fb-overview-body">
          <div className="fb-table-block">
            <div className="fb-table">
              <div className="fb-row fb-row-head">
                <span>Source</span>
                <span>Post</span>
                <span>Impressions</span>
                <span>Likes</span>
                <span>Amount Spent</span>
                <span>Engagement</span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="fb-row">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <span key={j} className="fb-skeleton-cell" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="fb-table-block">
            <div className="fb-table">
              <div className="fb-row fb-row-head fb-page-row">
                <span>Source</span>
                <span>Account / Page</span>
                <span>Impressions</span>
                <span>Post Engagement</span>
                <span>Profile Views</span>
                <span>Followers / Likes</span>
                <span>Reach</span>
              </div>
              <div className="fb-row fb-page-row">
                {Array.from({ length: 7 }).map((_, j) => (
                  <span key={j} className="fb-skeleton-cell" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="fb-overview-state error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="fb-overview-body">
          {hasInstagramUnavailableMetrics && (
            <div className="fb-overview-state" style={{ marginBottom: '10px' }}>
              <p>
                Some Instagram post-level metrics are unavailable via API for this
                date range. Values are shown as N/A where Meta did not provide data.
              </p>
            </div>
          )}
          <div className="fb-table-block">
            <div className="fb-table">
              <div className="fb-row fb-row-head">
                <span>Source</span>
                <span>Post</span>
                <span>Impressions</span>
                <span>Likes</span>
                <span>Amount Spent</span>
                <span>Engagement</span>
              </div>

              {postRows.length === 0 && (
                <div className="fb-row fb-row-empty">
                  <span>No Facebook or Instagram posts found.</span>
                </div>
              )}

              {postRows.map((row) => (
                <div key={row.id} className="fb-row">
                  <span>{row.source}</span>
                  <span>{row.campaign}</span>
                  <span className="metric metric-impressions">
                    {row.source === 'instagram' && row.impressions === 0
                      ? 'N/A'
                      : compactNumber(row.impressions)}
                  </span>
                  <span className="metric metric-clicks">{compactNumber(row.clicks)}</span>
                  <span className="metric metric-spend">
                    {row.source === 'instagram' && row.amountSpent === 0
                      ? 'N/A'
                      : money(row.amountSpent)}
                  </span>
                  <span className="metric metric-post-engagement">
                    {compactNumber(row.postEngagement)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="fb-table-block">
            <div className="fb-table">
              <div className="fb-row fb-row-head fb-page-row">
                <span>Source</span>
                <span>Account / Page</span>
                <span>Impressions</span>
                <span>Post Engagement</span>
                <span>Profile Views</span>
                <span>Followers / Likes</span>
                <span>Reach</span>
              </div>

              {summaries.map((summary) => (
                <div key={summary.source + summary.accountId} className="fb-row fb-page-row">
                  <span>{summary.source}</span>
                  <span>{summary.pageName || summary.accountId}</span>
                  <span className="metric metric-impressions">
                    {compactNumber(summary.impressions)}
                  </span>
                  <span className="metric metric-clicks">
                    {compactNumber(summary.postEngagement)}
                  </span>
                  <span className="metric metric-spend">
                    {compactNumber(summary.pageEngagement)}
                  </span>
                  <span>{compactNumber(summary.pageLikes)}</span>
                  <span>{compactNumber(summary.reach)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InstagramOverview;
