/**
 * Dashboard API (runs on port 5000).
 *
 * Env vars:
 *   INSTAGRAM_ACCESS_TOKEN       - Meta access token with instagram_basic, pages_read_engagement
 *   BECKLEY_PARTYHALL_IG_USER_ID - Instagram *Business* account ID (numeric). Use this if you have it.
 *   FACEBOOK_PAGE_ID             - Optional. If set and IG User ID is missing, we resolve Page -> Instagram Business Account.
 *   PAGESPEED_API_KEY            - Optional Google PageSpeed Insights API key.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = Number(process.env.PORT || 5000);
const GRAPH_BASE_URL = 'https://graph.facebook.com';
const PAGESPEED_BASE_URL =
  'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const parseEnvFile = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) return;
    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

parseEnvFile();

const toISODate = (value) => value.toISOString().slice(0, 10);

const defaultDateRange = () => {
  const until = new Date();
  const since = new Date(until);
  since.setDate(until.getDate() - 6);
  return { since: toISODate(since), until: toISODate(until) };
};

const parseNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const sumMetricValues = (values) =>
  values.reduce((total, item) => total + parseNumber(item.value), 0);

const getInsightMetricTotal = (insightsPayload, metricName) => {
  if (!insightsPayload || !Array.isArray(insightsPayload.data)) return 0;
  const metric = insightsPayload.data.find((item) => item?.name === metricName);
  if (!metric || !Array.isArray(metric.values)) return 0;
  return sumMetricValues(metric.values);
};

const buildGraphUrl = (pathValue, params, accessToken) => {
  const search = new URLSearchParams({ ...params, access_token: accessToken });
  return `${GRAPH_BASE_URL}/${pathValue}?${search.toString()}`;
};

const OVERVIEW_CACHE_TTL_MS = 90 * 1000;
const overviewCache = new Map();
const INSTAGRAM_CLIENTS = {
  'party-hall': {
    igUserIdEnv: 'BECKLEY_PARTYHALL_IG_USER_ID',
    facebookPageIdEnv: 'FACEBOOK_PAGE_ID',
    includeFacebook: true,
  },
  'walker-advisor': {
    igUserIdEnv: 'WALKER_ADVISOR_IG_USER_ID',
    facebookPageIdEnv: 'WALKER_ADVISOR_FACEBOOK_PAGE_ID',
    includeFacebook: false,
  },
};
const SITE_HEALTH_CACHE_TTL_MS = 5 * 60 * 1000;
const siteHealthCache = new Map();
const SITE_HEALTH_CLIENT_URLS = {
  'walker-advisor': 'https://thewalkeradvisor.com/',
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const relayMetaError = async (res, response, label) => {
  let details = null;
  try {
    details = await response.json();
  } catch {
    details = null;
  }

  const metaMessage =
    details &&
    details.error &&
    typeof details.error.message === 'string'
      ? details.error.message
      : null;

  sendJson(res, response.status, {
    error: metaMessage || `${label} failed with status ${response.status}.`,
    metaError: details,
  });
};

const getMetaErrorFromResponse = async (response, fallback) => {
  try {
    const details = await response.json();
    const metaMessage =
      details &&
      details.error &&
      typeof details.error.message === 'string'
        ? details.error.message
        : null;
    return metaMessage || fallback;
  } catch {
    return fallback;
  }
};

const normalizePageUrl = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    return parsed.toString();
  } catch {
    return '';
  }
};

const toPercentScore = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.round(value * 100);
};

const formatMs = (value) => {
  const numeric = parseNumber(value);
  if (!numeric) return '0 ms';
  if (numeric >= 1000) return `${(numeric / 1000).toFixed(1)} s`;
  return `${Math.round(numeric)} ms`;
};

const parseLoadingMetric = (metric) => {
  if (!metric || !Array.isArray(metric.distributions)) {
    return {
      percentile: 0,
      displayValue: '-',
      category: 'NO_DATA',
      distributions: [],
    };
  }

  return {
    percentile: parseNumber(metric.percentile),
    displayValue: metric.percentile
      ? formatMs(parseNumber(metric.percentile))
      : '-',
    category: metric.category || 'NO_DATA',
    distributions: metric.distributions.map((row) => ({
      min: parseNumber(row.min),
      max: parseNumber(row.max),
      proportion: parseNumber(row.proportion),
    })),
  };
};

const pickLoadingMetric = (pageMetrics, originMetrics, key) => {
  if (pageMetrics && pageMetrics[key]) return pageMetrics[key];
  if (originMetrics && originMetrics[key]) return originMetrics[key];
  return null;
};

const getMetricAuditValue = (audits, key) => {
  if (!audits || !audits[key]) {
    return {
      id: key,
      title: key,
      displayValue: '-',
      numericValue: 0,
      score: null,
    };
  }
  const metric = audits[key];
  return {
    id: key,
    title: metric.title || key,
    displayValue: metric.displayValue || '-',
    numericValue: parseNumber(metric.numericValue),
    score: typeof metric.score === 'number' ? metric.score : null,
  };
};

const getTopOpportunities = (audits) => {
  if (!audits || typeof audits !== 'object') return [];
  return Object.keys(audits)
    .map((key) => {
      const audit = audits[key];
      return {
        id: key,
        title: audit?.title || key,
        description: audit?.description || '',
        score: typeof audit?.score === 'number' ? audit.score : null,
        displayValue: audit?.displayValue || '',
        savingsMs: parseNumber(audit?.details?.overallSavingsMs),
      };
    })
    .filter(
      (item) => item.savingsMs > 0 && item.score !== null && item.score < 1
    )
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 5);
};

const buildPageSpeedPayload = (strategy, data) => {
  const lighthouse = data?.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};
  const loadingExperience = data?.loadingExperience?.metrics || {};
  const originLoadingExperience = data?.originLoadingExperience?.metrics || {};

  return {
    strategy,
    fetchedAt: new Date().toISOString(),
    lighthouse: {
      finalUrl: lighthouse.finalUrl || data?.id || '',
      fetchTime: lighthouse.fetchTime || new Date().toISOString(),
      scores: {
        performance: toPercentScore(categories.performance?.score),
        accessibility: toPercentScore(categories.accessibility?.score),
        bestPractices: toPercentScore(categories['best-practices']?.score),
        seo: toPercentScore(categories.seo?.score),
      },
      metrics: {
        firstContentfulPaint: getMetricAuditValue(
          audits,
          'first-contentful-paint'
        ),
        largestContentfulPaint: getMetricAuditValue(
          audits,
          'largest-contentful-paint'
        ),
        speedIndex: getMetricAuditValue(audits, 'speed-index'),
        totalBlockingTime: getMetricAuditValue(audits, 'total-blocking-time'),
        cumulativeLayoutShift: getMetricAuditValue(
          audits,
          'cumulative-layout-shift'
        ),
        interactionToNextPaint: getMetricAuditValue(
          audits,
          'interaction-to-next-paint'
        ),
      },
      topOpportunities: getTopOpportunities(audits),
    },
    fieldData: {
      coreWebVitals: {
        lcp: parseLoadingMetric(
          pickLoadingMetric(
            loadingExperience,
            originLoadingExperience,
            'LARGEST_CONTENTFUL_PAINT_MS'
          )
        ),
        inp: parseLoadingMetric(
          pickLoadingMetric(
            loadingExperience,
            originLoadingExperience,
            'INTERACTION_TO_NEXT_PAINT'
          )
        ),
        cls: parseLoadingMetric(
          pickLoadingMetric(
            loadingExperience,
            originLoadingExperience,
            'CUMULATIVE_LAYOUT_SHIFT_SCORE'
          )
        ),
      },
    },
  };
};

const fetchPageSpeedStrategy = async ({ pageUrl, strategy, apiKey }) => {
  const params = new URLSearchParams({
    url: pageUrl,
    strategy,
    category: 'performance',
  });
  params.append('category', 'accessibility');
  params.append('category', 'best-practices');
  params.append('category', 'seo');
  if (apiKey) {
    params.set('key', apiKey);
  }

  const response = await fetch(`${PAGESPEED_BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    let details = null;
    try {
      details = await response.json();
    } catch {
      details = null;
    }
    const apiMessage =
      details &&
      details.error &&
      typeof details.error.message === 'string'
        ? details.error.message
        : null;
    throw new Error(
      apiMessage || `PageSpeed API failed for ${strategy} (${response.status}).`
    );
  }
  const data = await response.json();
  return buildPageSpeedPayload(strategy, data);
};

const requestHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const requestUrl = new URL(req.url || '/', `http://${req.headers.host}`);

  if (requestUrl.pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (
    requestUrl.pathname === '/api/site-health/overview' &&
    req.method === 'GET'
  ) {
    const client = (requestUrl.searchParams.get('client') || 'walker-advisor')
      .trim()
      .toLowerCase();
    const strategyParam = (requestUrl.searchParams.get('strategy') || 'all')
      .trim()
      .toLowerCase();
    const forceRefresh = requestUrl.searchParams.get('force') === '1';
    const fallbackUrl = SITE_HEALTH_CLIENT_URLS[client] || '';
    const pageUrl = normalizePageUrl(
      requestUrl.searchParams.get('url') || fallbackUrl
    );
    const apiKey = (process.env.PAGESPEED_API_KEY || '').trim();

    if (!pageUrl) {
      sendJson(res, 400, {
        error:
          'Unsupported client or invalid url. Provide ?client=walker-advisor or a valid ?url=',
      });
      return;
    }

    let strategies = ['mobile', 'desktop'];
    if (strategyParam === 'mobile' || strategyParam === 'desktop') {
      strategies = [strategyParam];
    } else if (strategyParam !== 'all') {
      sendJson(res, 400, {
        error: 'Invalid strategy. Use mobile, desktop, or all.',
      });
      return;
    }

    const cacheKey = `site-health:${client}:${pageUrl}:${strategies.join(',')}`;
    const cached = siteHealthCache.get(cacheKey);
    if (
      !forceRefresh &&
      cached &&
      Date.now() - cached.at < SITE_HEALTH_CACHE_TTL_MS
    ) {
      sendJson(res, 200, cached.payload);
      return;
    }

    try {
      const strategyData = await Promise.all(
        strategies.map((strategy) =>
          fetchPageSpeedStrategy({ pageUrl, strategy, apiKey })
        )
      );
      const payload = {
        source: 'pagespeed-insights',
        client,
        url: pageUrl,
        fetchedAt: new Date().toISOString(),
        strategies: strategyData.reduce((acc, item) => {
          acc[item.strategy] = item;
          return acc;
        }, {}),
      };
      siteHealthCache.set(cacheKey, { at: Date.now(), payload });
      sendJson(res, 200, payload);
    } catch (error) {
      sendJson(res, 502, {
        error: error instanceof Error ? error.message : 'PageSpeed API failed.',
      });
    }
    return;
  }

  if (requestUrl.pathname !== '/api/instagram/overview' || req.method !== 'GET') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const client = (requestUrl.searchParams.get('client') || 'party-hall')
    .trim()
    .toLowerCase();
  const clientConfig = INSTAGRAM_CLIENTS[client];
  if (!clientConfig) {
    sendJson(res, 400, { error: 'Unsupported client.' });
    return;
  }

  const range = defaultDateRange();
  const since = requestUrl.searchParams.get('since') || range.since;
  const until = requestUrl.searchParams.get('until') || range.until;

  const accessToken =
    process.env.INSTAGRAM_ACCESS_TOKEN ||
    process.env.REACT_APP_FB_ACCESS_TOKEN ||
    '';
  const igUserIdFromEnv = (
    process.env[clientConfig.igUserIdEnv] || ''
  ).trim();
  const facebookPageId = (
    process.env[clientConfig.facebookPageIdEnv] || ''
  ).trim();
  const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION || 'v20.0';

  if (!accessToken) {
    sendJson(res, 400, {
      error:
        'Set INSTAGRAM_ACCESS_TOKEN (or REACT_APP_FB_ACCESS_TOKEN) in .env',
    });
    return;
  }

  let igUserId = igUserIdFromEnv;
  let pageData = null;

  const cacheKey = `overview:${client}:${since}:${until}`;
  const cached = overviewCache.get(cacheKey);
  if (cached && Date.now() - cached.at < OVERVIEW_CACHE_TTL_MS) {
    sendJson(res, 200, cached.payload);
    return;
  }

  try {
    // Resolve page metadata only when needed:
    // - Facebook summary is enabled, or
    // - Instagram user id must be resolved from page mapping.
    const shouldFetchPageData =
      Boolean(facebookPageId) &&
      (clientConfig.includeFacebook || !igUserId);

    if (shouldFetchPageData && facebookPageId) {
      const pageFields = clientConfig.includeFacebook
        ? 'id,name,fan_count,instagram_business_account{id}'
        : 'id,name,instagram_business_account{id}';
      const pageUrl = buildGraphUrl(
        `${graphVersion}/${facebookPageId}`,
        { fields: pageFields },
        accessToken
      );
      const pageResponse = await fetch(pageUrl);
      if (!pageResponse.ok) {
        await relayMetaError(res, pageResponse, 'Facebook Page API');
        return;
      }
      pageData = await pageResponse.json();
      if (!igUserId && pageData?.instagram_business_account?.id) {
        igUserId = pageData.instagram_business_account.id;
      }
    }

    const result = { dateRange: { since, until }, instagram: null, facebook: null };

    const fetchFacebook = async () => {
      if (!clientConfig.includeFacebook) return null;
      if (!facebookPageId || !pageData) return null;
      const fbPostsUrl = buildGraphUrl(
        `${graphVersion}/${facebookPageId}/posts`,
        { fields: 'id,message,created_time,full_picture', limit: '20' },
        accessToken
      );
      const fbInsightsUrl = buildGraphUrl(
        `${graphVersion}/${facebookPageId}/insights`,
        {
          metric: 'page_impressions,page_engaged_users,page_reach',
          period: 'day',
          since,
          until,
        },
        accessToken
      );
      const [fbPostsRes, fbInsightsRes] = await Promise.all([
        fetch(fbPostsUrl),
        fetch(fbInsightsUrl),
      ]);
      const fbPostsData = fbPostsRes.ok ? await fbPostsRes.json() : { data: [] };
      const fbInsightsData = fbInsightsRes.ok ? await fbInsightsRes.json() : { data: [] };
      const fbPosts = Array.isArray(fbPostsData?.data)
        ? fbPostsData.data.map((row) => ({
            id: row.id,
            source: 'facebook',
            campaign: (row.message || '').slice(0, 70) || 'Facebook post',
            impressions: 0,
            clicks: 0,
            amountSpent: 0,
            postEngagement: 0,
          }))
        : [];
      const fbInsightMap = new Map();
      if (Array.isArray(fbInsightsData?.data)) {
        fbInsightsData.data.forEach((m) => {
          if (m?.name && Array.isArray(m?.values)) fbInsightMap.set(m.name, m.values);
        });
      }
      return {
        posts: fbPosts,
        summary: {
          source: 'facebook',
          accountId: pageData.id,
          pageName: pageData.name || pageData.id,
          impressions: sumMetricValues(fbInsightMap.get('page_impressions') || []),
          postEngagement: sumMetricValues(fbInsightMap.get('page_engaged_users') || []),
          pageEngagement: sumMetricValues(fbInsightMap.get('page_engaged_users') || []),
          pageLikes: parseNumber(pageData.fan_count),
          reach: sumMetricValues(fbInsightMap.get('page_reach') || []),
        },
      };
    };

    const fetchInstagram = async () => {
      if (!igUserId) return null;
      const mediaUrl = buildGraphUrl(
        `${graphVersion}/${igUserId}/media`,
        {
          fields: 'id,caption,media_type,like_count,comments_count,timestamp,permalink',
          limit: '20',
        },
        accessToken
      );
      const accountUrl = buildGraphUrl(
        `${graphVersion}/${igUserId}`,
        { fields: 'id,username,followers_count,follows_count,media_count' },
        accessToken
      );
      const insightsUrl = buildGraphUrl(
        `${graphVersion}/${igUserId}/insights`,
        { metric: 'impressions,reach', period: 'day', since, until },
        accessToken
      );
      const [mediaResponse, accountResponse, insightsResponse] = await Promise.all([
        fetch(mediaUrl),
        fetch(accountUrl),
        fetch(insightsUrl),
      ]);
      if (!mediaResponse.ok) {
        throw new Error(
          await getMetaErrorFromResponse(
            mediaResponse,
            `Instagram media API failed with status ${mediaResponse.status}.`
          )
        );
      }
      if (!accountResponse.ok) {
        throw new Error(
          await getMetaErrorFromResponse(
            accountResponse,
            `Instagram account API failed with status ${accountResponse.status}.`
          )
        );
      }
      const mediaData = await mediaResponse.json();
      const accountData = await accountResponse.json();
      const insightsData = insightsResponse.ok
        ? await insightsResponse.json()
        : { data: [] };
      const mediaRows = Array.isArray(mediaData?.data) ? mediaData.data : [];

      const mediaInsightsById = new Map();
      await Promise.all(
        mediaRows.map(async (row) => {
          const mediaId = row?.id;
          if (!mediaId) return;
          try {
            const mediaInsightsUrl = buildGraphUrl(
              `${graphVersion}/${mediaId}/insights`,
              { metric: 'impressions,reach', period: 'lifetime' },
              accessToken
            );
            const mediaInsightsResponse = await fetch(mediaInsightsUrl);
            if (!mediaInsightsResponse.ok) return;
            const mediaInsightsData = await mediaInsightsResponse.json();
            mediaInsightsById.set(mediaId, {
              impressions: getInsightMetricTotal(
                mediaInsightsData,
                'impressions'
              ),
              reach: getInsightMetricTotal(mediaInsightsData, 'reach'),
            });
          } catch {
            /* ignore per-media failures and keep row defaults */
          }
        })
      );

      const posts = Array.isArray(mediaData?.data)
        ? mediaData.data.map((row) => {
            const likes = parseNumber(row.like_count);
            const comments = parseNumber(row.comments_count);
            const mediaInsight = mediaInsightsById.get(row.id);
            return {
              id: row.id,
              source: 'instagram',
              campaign: row.caption?.slice(0, 70) || `${row.media_type || 'MEDIA'} post`,
              impressions: parseNumber(mediaInsight?.impressions),
              clicks: likes,
              amountSpent: 0,
              postEngagement: likes + comments,
            };
          })
        : [];
      const insightMap = new Map();
      if (Array.isArray(insightsData?.data)) {
        insightsData.data.forEach((metric) => {
          if (metric?.name && Array.isArray(metric?.values)) {
            insightMap.set(metric.name, metric.values);
          }
        });
      }
      return {
        posts,
        summary: {
          source: 'instagram',
          accountId: accountData?.id || igUserId,
          impressions: sumMetricValues(insightMap.get('impressions') || []),
          postEngagement: posts.reduce((total, item) => total + item.postEngagement, 0),
          pageEngagement: posts.reduce((total, item) => total + item.postEngagement, 0),
          pageLikes: parseNumber(accountData?.followers_count),
          reach: sumMetricValues(insightMap.get('reach') || []),
        },
      };
    };

    const [fbResult, igResult] = await Promise.all([
      fetchFacebook(),
      fetchInstagram(),
    ]);

    if (fbResult) result.facebook = fbResult;
    if (igResult) result.instagram = igResult;

    if (!result.facebook && !result.instagram) {
      const setupHint = clientConfig.includeFacebook
        ? `Set ${clientConfig.facebookPageIdEnv} (for Facebook + Instagram) or ${clientConfig.igUserIdEnv} (Instagram only) in .env`
        : `Set ${clientConfig.igUserIdEnv} (recommended) or ${clientConfig.facebookPageIdEnv} (to resolve Instagram Business account) in .env`;
      sendJson(res, 400, {
        error: setupHint,
      });
      return;
    }

    if (result.instagram && !result.facebook) {
      result.posts = result.instagram.posts;
      result.summary = result.instagram.summary;
    } else if (result.facebook && !result.instagram) {
      result.posts = result.facebook.posts;
      result.summary = result.facebook.summary;
    }

    overviewCache.set(cacheKey, { at: Date.now(), payload: result });
    sendJson(res, 200, result);
  } catch (error) {
    const causeMessage =
      error &&
      typeof error === 'object' &&
      'cause' in error &&
      error.cause &&
      typeof error.cause === 'object' &&
      'message' in error.cause &&
      typeof error.cause.message === 'string'
        ? error.cause.message
        : null;

    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
      cause: causeMessage,
    });
  }
};

const server = http.createServer((req, res) => {
  requestHandler(req, res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Instagram API server listening on http://localhost:${PORT}`);
});
