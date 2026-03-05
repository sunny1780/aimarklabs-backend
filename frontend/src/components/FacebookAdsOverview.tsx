import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type FacebookAdsOverviewProps = {
  clientName: string;
};

type CampaignRow = {
  id: string;
  source: string;
  campaign: string;
  impressions: number;
  clicks: number;
  amountSpent: number;
  postEngagement: number;
};

type PageSummary = {
  source: string;
  pageId: string;
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

const WALKER_CAMPAIGN_KEYWORDS = [
  'walker',
  'thewalkeradvisor',
  'the walker advisor',
  'walker advisor',
];

const GRAPH_BASE_URL = 'https://graph.facebook.com';

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

const parseNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const compactNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  if (value % 1 !== 0) return value.toFixed(1);
  return value.toString();
};

const money = (value: number): string =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

const isWalkerCampaign = (campaignName: string): boolean => {
  const normalized = campaignName.toLowerCase();
  return WALKER_CAMPAIGN_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );
};

const getActionValue = (
  actions: Array<{ action_type?: string; value?: string }> | undefined,
  actionType: string
): number => {
  if (!actions) return 0;
  return actions
    .filter((action) => action.action_type === actionType)
    .reduce((total, action) => total + parseNumber(action.value), 0);
};

const getMetaErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = await response.json();
    const message =
      payload &&
      payload.error &&
      typeof payload.error.message === 'string'
        ? payload.error.message
        : '';
    if (message) return message;
  } catch {
    /* ignore */
  }
  return fallback;
};

const normalizeFacebookError = (message: string): string => {
  const lower = message.toLowerCase();
  if (
    lower.includes('error validating access token') ||
    lower.includes('session has expired')
  ) {
    return 'Facebook access token expired. Update REACT_APP_FB_ACCESS_TOKEN in .env and restart the app.';
  }
  return message;
};

const CACHE_KEY = 'fb-ads-overview';
const cache = new Map<string, { campaigns: CampaignRow[]; summary: PageSummary }>();
const STORAGE_KEY_PREFIX = 'fb-ads-overview-storage';
const STORAGE_MAX_AGE_MS = 5 * 60 * 1000;

const getFromStorage = (
  since: string,
  until: string
): { campaigns: CampaignRow[]; summary: PageSummary } | null => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}:${since}:${until}`);
    if (!raw) return null;
    const { campaigns, summary, at } = JSON.parse(raw);
    if (Date.now() - at > STORAGE_MAX_AGE_MS) return null;
    return Array.isArray(campaigns) && summary && typeof summary === 'object'
      ? { campaigns, summary }
      : null;
  } catch {
    return null;
  }
};

const setToStorage = (
  since: string,
  until: string,
  campaigns: CampaignRow[],
  summary: PageSummary
) => {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}:${since}:${until}`,
      JSON.stringify({ campaigns, summary, at: Date.now() })
    );
  } catch {
    /* ignore */
  }
};

const FacebookAdsOverview: React.FC<FacebookAdsOverviewProps> = ({
  clientName,
}) => {
  const [dateRange] = useState<DateRange>(() => getDefaultRange());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignRows, setCampaignRows] = useState<CampaignRow[]>([]);
  const [pageSummary, setPageSummary] = useState<PageSummary | null>(null);
  const inFlightRef = useRef(false);

  const accessToken = (process.env.REACT_APP_FB_ACCESS_TOKEN || '').trim();
  const rawAdAccountId = (process.env.REACT_APP_WALKER_AD_ACCOUNT_ID || '').trim();
  const adAccountId = rawAdAccountId.replace(/^act_/i, '');
  const pageId = (process.env.REACT_APP_WALKER_PAGE_ID || '').trim();
  const graphVersion = process.env.REACT_APP_FACEBOOK_GRAPH_VERSION || 'v20.0';

  const missingEnvKeys = useMemo(
    () =>
      [
        !accessToken || accessToken.includes('your_')
          ? 'REACT_APP_FB_ACCESS_TOKEN'
          : null,
        !adAccountId || adAccountId.includes('your_')
          ? 'REACT_APP_WALKER_AD_ACCOUNT_ID'
          : null,
        !pageId || pageId.includes('your_') ? 'REACT_APP_WALKER_PAGE_ID' : null,
      ].filter(Boolean) as string[],
    [accessToken, adAccountId, pageId]
  );
  const configMissing = missingEnvKeys.length > 0;
  const missingEnvKeysText = useMemo(
    () => missingEnvKeys.join(', '),
    [missingEnvKeys]
  );

  const dateLabel = useMemo(
    () => `${formatDateLabel(dateRange.since)} - ${formatDateLabel(dateRange.until)}`,
    [dateRange.since, dateRange.until]
  );

  const buildGraphUrl = useCallback(
    (path: string, params: Record<string, string>): string => {
      const search = new URLSearchParams({ ...params, access_token: accessToken });
      return `${GRAPH_BASE_URL}/${path}?${search.toString()}`;
    },
    [accessToken]
  );

  const fetchData = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    if (configMissing) {
      setLoading(false);
      setError(
        `Facebook credentials missing: ${missingEnvKeysText}. Update .env and restart npm start.`
      );
      inFlightRef.current = false;
      return;
    }

    const cacheKey = `${CACHE_KEY}:${dateRange.since}:${dateRange.until}`;
    const memCached = cache.get(cacheKey);
    const storageCached = getFromStorage(dateRange.since, dateRange.until);

    if (memCached) {
      setCampaignRows(memCached.campaigns);
      setPageSummary(memCached.summary);
      setLoading(false);
    } else if (storageCached) {
      setCampaignRows(storageCached.campaigns);
      setPageSummary(storageCached.summary);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const adsUrl = buildGraphUrl(`${graphVersion}/act_${adAccountId}/insights`, {
        fields: 'campaign_name,impressions,clicks,spend,actions',
        level: 'ad',
        limit: '100',
        time_increment: 'all_days',
        time_range: JSON.stringify({
          since: dateRange.since,
          until: dateRange.until,
        }),
      });

      const adsResponse = await fetch(adsUrl);

      if (!adsResponse.ok) {
        const message = await getMetaErrorMessage(
          adsResponse,
          `Facebook Ads API failed with status ${adsResponse.status}.`
        );
        throw new Error(message);
      }
      const adsData = await adsResponse.json();

      const mappedCampaigns: CampaignRow[] = Array.isArray(adsData?.data)
        ? adsData.data.map((row: any, index: number) => ({
        id: row.ad_id || `campaign-${index}`,
        source: 'facebook',
        campaign: row.campaign_name || 'Untitled Campaign',
        impressions: parseNumber(row.impressions),
        clicks: parseNumber(row.clicks),
        amountSpent: parseNumber(row.spend),
        postEngagement: getActionValue(row.actions, 'post_engagement'),
      }))
        : [];
      const walkerCampaigns = mappedCampaigns.filter((row) =>
        isWalkerCampaign(row.campaign)
      );

      const totalImpressions = walkerCampaigns.reduce(
        (sum, item) => sum + item.impressions,
        0
      );
      const totalPostEngagement = walkerCampaigns.reduce(
        (sum, item) => sum + item.postEngagement,
        0
      );
      const estimatedReach = Math.round(totalImpressions * 0.7);
      const pageLikes = 0;

      const summary: PageSummary = {
        source: 'facebook',
        pageId,
        impressions: totalImpressions,
        postEngagement: totalPostEngagement,
        pageEngagement: totalPostEngagement,
        pageLikes,
        reach: estimatedReach,
      };

      cache.set(cacheKey, { campaigns: walkerCampaigns, summary });
      setToStorage(dateRange.since, dateRange.until, walkerCampaigns, summary);
      setCampaignRows(walkerCampaigns);
      setPageSummary(summary);
    } catch (fetchError) {
      setCampaignRows([]);
      setPageSummary(null);
      setError(
        fetchError instanceof Error
          ? normalizeFacebookError(fetchError.message)
          : 'Failed to load Facebook data.'
      );
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [
    adAccountId,
    buildGraphUrl,
    configMissing,
    dateRange.since,
    dateRange.until,
    graphVersion,
    missingEnvKeysText,
    pageId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const SkeletonRow = ({
    cols,
    className = '',
  }: {
    cols: number;
    className?: string;
  }) => (
    <div className={`fb-row ${className}`.trim()}>
      {Array.from({ length: cols }).map((_, i) => (
        <span key={i} className="fb-skeleton-cell" />
      ))}
    </div>
  );
  const hasData = campaignRows.length > 0 || Boolean(pageSummary);
  const showPageLikes = Boolean(pageSummary && pageSummary.pageLikes > 0);
  const pageRowClass = showPageLikes ? 'fb-page-row' : 'fb-page-row-no-likes';

  return (
    <section className="fb-overview-card">
      <header className="fb-overview-header">
        <div className="fb-overview-title-wrap">
          <p className="fb-overview-kicker">{clientName.toUpperCase()} FACEBOOK ADS DASHBOARD</p>
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
                <span>Campaign</span>
                <span>Impressions</span>
                <span>Clicks</span>
                <span>Amount Spent</span>
                <span>Post Engagement</span>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonRow key={i} cols={6} />
              ))}
            </div>
          </div>
          <div className="fb-table-block">
            <div className="fb-table">
              <div className={`fb-row fb-row-head ${pageRowClass}`}>
                <span>Source</span>
                <span>Facebook Page ID</span>
                <span>Impressions</span>
                <span>Post Engagement</span>
                <span>Page Engagement</span>
                {showPageLikes && <span>Page Likes</span>}
                <span>Reach</span>
              </div>
              <SkeletonRow
                cols={showPageLikes ? 7 : 6}
                className={pageRowClass}
              />
            </div>
          </div>
        </div>
      )}

      {!loading && error && !hasData && (
        <div className="fb-overview-state error">
          <p>{error}</p>
        </div>
      )}

      {!loading && error && hasData && (
        <div className="fb-overview-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && hasData && (
        <div className="fb-overview-body">
          <div className="fb-table-block">
            <div className="fb-table">
              <div className="fb-row fb-row-head">
                <span>Source</span>
                <span>Campaign</span>
                <span>Impressions</span>
                <span>Clicks</span>
                <span>Amount Spent</span>
                <span>Post Engagement</span>
              </div>

              {campaignRows.length === 0 && (
                <div className="fb-row fb-row-empty">
                  <span>No campaign data available for selected range.</span>
                </div>
              )}

              {campaignRows.map((row) => (
                <div key={row.id} className="fb-row">
                  <span>{row.source}</span>
                  <span>{row.campaign}</span>
                  <span className="metric metric-impressions">
                    {compactNumber(row.impressions)}
                  </span>
                  <span className="metric metric-clicks">{compactNumber(row.clicks)}</span>
                  <span className="metric metric-spend">{money(row.amountSpent)}</span>
                  <span className="metric metric-post-engagement">
                    {compactNumber(row.postEngagement)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="fb-table-block">
            <div className="fb-table">
              <div className={`fb-row fb-row-head ${pageRowClass}`}>
                <span>Source</span>
                <span>Facebook Page ID</span>
                <span>Impressions</span>
                <span>Post Engagement</span>
                <span>Page Engagement</span>
                {showPageLikes && <span>Page Likes</span>}
                <span>Reach</span>
              </div>

              {pageSummary && (
                <div className={`fb-row ${pageRowClass}`}>
                  <span>{pageSummary.source}</span>
                  <span>{pageSummary.pageId}</span>
                  <span className="metric metric-impressions">
                    {compactNumber(pageSummary.impressions)}
                  </span>
                  <span className="metric metric-clicks">
                    {compactNumber(pageSummary.postEngagement)}
                  </span>
                  <span className="metric metric-spend">
                    {compactNumber(pageSummary.pageEngagement)}
                  </span>
                  {showPageLikes && <span>{compactNumber(pageSummary.pageLikes)}</span>}
                  <span>{compactNumber(pageSummary.reach)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FacebookAdsOverview;
