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
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 5000);
const GRAPH_BASE_URL = 'https://graph.facebook.com';
const PAGESPEED_BASE_URL =
  'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_BASE_URL = 'https://www.googleapis.com/webmasters/v3';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const GA4_BASE_URL = 'https://analyticsdata.googleapis.com/v1beta';
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const parseEnvFile = () => {
  const envCandidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];

  envCandidates.forEach((envPath) => {
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

const formatGoogleFetchError = (error, serviceLabel) => {
  const fallback = `Unexpected ${serviceLabel} error.`;
  if (!(error instanceof Error)) return fallback;
  if (error.message === 'fetch failed') {
    return `${serviceLabel} request could not reach Google APIs. Check internet/proxy/firewall on backend host and try again.`;
  }
  return error.message || fallback;
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
  talkearlyed: {
    igUserIdEnv: 'TALKEARLYED_IG_USER_ID',
    facebookPageIdEnv: 'TALKEARLYED_FACEBOOK_PAGE_ID',
    includeFacebook: true,
  },
};
const FACEBOOK_ADS_CLIENTS = {
  'walker-advisor': {
    adAccountIdEnv: 'WALKER_ADVISOR_AD_ACCOUNT_ID',
    facebookPageIdEnv: 'WALKER_ADVISOR_FACEBOOK_PAGE_ID',
    filterWalkerCampaigns: true,
  },
  talkearlyed: {
    adAccountIdEnv: 'TALKEARLYED_AD_ACCOUNT_ID',
    facebookPageIdEnv: 'TALKEARLYED_FACEBOOK_PAGE_ID',
    filterWalkerCampaigns: false,
  },
};
const YOUTUBE_CLIENTS = {
  'walker-advisor': {
    channelIdEnv: 'WALKER_ADVISOR_YOUTUBE_CHANNEL_ID',
  },
  talkearlyed: {
    channelIdEnv: 'TALKEARLYED_YOUTUBE_CHANNEL_ID',
  },
};
const WALKER_CAMPAIGN_KEYWORDS = [
  'walker',
  'thewalkeradvisor',
  'the walker advisor',
  'walker advisor',
];
const SITE_HEALTH_CACHE_TTL_MS = 5 * 60 * 1000;
const siteHealthCache = new Map();
const SITE_HEALTH_CLIENT_URLS = {
  'little-sicily': (process.env.LITTLE_SICILY_SITE_URL || '').trim(),
  'cash-for-gold': (
    process.env.CASH_FOR_GOLD_SITE_URL || 'http://cashforgoldbeckley.com'
  ).trim(),
  'evolo-ai': (process.env.EVOLO_AI_SITE_URL || 'https://goevolo.com/').trim(),
  'walker-advisor': 'https://thewalkeradvisor.com/',
};
const GSC_CLIENT_SITE_URLS = {
  'walker-advisor': 'sc-domain:thewalkeradvisor.com',
};
const GA4_CLIENTS = {
  'walker-advisor': {
    propertyIdEnv: 'WALKER_ADVISOR_GA4_PROPERTY_ID',
  },
};
const GSC_TOKEN_TTL_SKEW_MS = 60 * 1000;
const gscTokenCacheByMode = {
  oauth: { accessToken: '', expiresAt: 0 },
  serviceAccount: { accessToken: '', expiresAt: 0 },
};
const ga4TokenCache = { accessToken: '', expiresAt: 0 };

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

const addDaysToISODate = (isoDate, days) => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
};

const isWalkerCampaignName = (campaignName) => {
  const normalized = String(campaignName || '').toLowerCase();
  return WALKER_CAMPAIGN_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );
};

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const readJsonFile = (jsonPath) => {
  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
};

const getGoogleServiceAccountCredentials = () => {
  const inlineJson = (process.env.GSC_SERVICE_ACCOUNT_JSON || '').trim();
  if (inlineJson) {
    try {
      const parsed = JSON.parse(inlineJson);
      return {
        clientEmail: parsed.client_email || '',
        privateKey: parsed.private_key || '',
      };
    } catch {
      throw new Error('GSC_SERVICE_ACCOUNT_JSON is not valid JSON.');
    }
  }

  const credentialsPath = (
    process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
  ).trim();
  if (!credentialsPath) {
    throw new Error(
      'Set GOOGLE_APPLICATION_CREDENTIALS (or GSC_SERVICE_ACCOUNT_JSON) in .env'
    );
  }

  const parsed = readJsonFile(credentialsPath);
  if (!parsed) {
    throw new Error(
      'Unable to read Google service account JSON from GOOGLE_APPLICATION_CREDENTIALS path.'
    );
  }

  return {
    clientEmail: parsed.client_email || '',
    privateKey: parsed.private_key || '',
  };
};

const getOAuthClientCredentials = () => {
  const clientId = (process.env.GSC_OAUTH_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GSC_OAUTH_CLIENT_SECRET || '').trim();
  const refreshToken = (process.env.GSC_OAUTH_REFRESH_TOKEN || '').trim();
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }
  return { clientId, clientSecret, refreshToken };
};

const getGscAccessTokenFromOAuthRefreshToken = async () => {
  const oauth = getOAuthClientCredentials();
  if (!oauth) {
    return null;
  }

  const cached = gscTokenCacheByMode.oauth;
  if (
    cached.accessToken &&
    Date.now() + GSC_TOKEN_TTL_SKEW_MS < cached.expiresAt
  ) {
    return cached.accessToken;
  }

  const body = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: oauth.refreshToken,
    grant_type: 'refresh_token',
  });

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResponse.ok) {
    let details = null;
    try {
      details = await tokenResponse.json();
    } catch {
      details = null;
    }
    const message =
      details &&
      typeof details.error_description === 'string' &&
      details.error_description
        ? details.error_description
        : 'Failed to obtain Google OAuth access token via refresh token.';
    throw new Error(message);
  }

  const tokenPayload = await tokenResponse.json();
  const accessToken =
    tokenPayload && typeof tokenPayload.access_token === 'string'
      ? tokenPayload.access_token
      : '';
  const expiresIn =
    tokenPayload && typeof tokenPayload.expires_in === 'number'
      ? tokenPayload.expires_in
      : 3600;

  if (!accessToken) {
    throw new Error('OAuth token response did not include access_token.');
  }

  cached.accessToken = accessToken;
  cached.expiresAt = Date.now() + expiresIn * 1000;
  return accessToken;
};

const getGscAccessTokenFromServiceAccount = async () => {
  const cached = gscTokenCacheByMode.serviceAccount;
  if (
    cached.accessToken &&
    Date.now() + GSC_TOKEN_TTL_SKEW_MS < cached.expiresAt
  ) {
    return cached.accessToken;
  }

  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Invalid service account JSON. Missing client_email or private_key.'
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: GSC_SCOPE,
    aud: GOOGLE_OAUTH_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);
  const assertion = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResponse.ok) {
    let details = null;
    try {
      details = await tokenResponse.json();
    } catch {
      details = null;
    }
    const message =
      details &&
      typeof details.error_description === 'string' &&
      details.error_description
        ? details.error_description
        : 'Failed to obtain Google OAuth access token.';
    throw new Error(message);
  }

  const tokenPayload = await tokenResponse.json();
  const accessToken =
    tokenPayload && typeof tokenPayload.access_token === 'string'
      ? tokenPayload.access_token
      : '';
  const expiresIn =
    tokenPayload && typeof tokenPayload.expires_in === 'number'
      ? tokenPayload.expires_in
      : 3600;

  if (!accessToken) {
    throw new Error('Google OAuth token response did not include access_token.');
  }

  cached.accessToken = accessToken;
  cached.expiresAt = Date.now() + expiresIn * 1000;
  return accessToken;
};

const getGscAccessToken = async () => {
  const oauthToken = await getGscAccessTokenFromOAuthRefreshToken();
  if (oauthToken) {
    return oauthToken;
  }
  return getGscAccessTokenFromServiceAccount();
};

const getGa4OAuthClientCredentials = () => {
  const clientId = (
    process.env.GA4_OAUTH_CLIENT_ID ||
    process.env.GSC_OAUTH_CLIENT_ID ||
    ''
  ).trim();
  const clientSecret = (
    process.env.GA4_OAUTH_CLIENT_SECRET ||
    process.env.GSC_OAUTH_CLIENT_SECRET ||
    ''
  ).trim();
  const refreshToken = (
    process.env.GA4_OAUTH_REFRESH_TOKEN ||
    process.env.GSC_OAUTH_REFRESH_TOKEN ||
    ''
  ).trim();
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }
  return { clientId, clientSecret, refreshToken };
};

const getGa4AccessTokenFromOAuthRefreshToken = async () => {
  const oauth = getGa4OAuthClientCredentials();
  if (!oauth) {
    return null;
  }

  if (
    ga4TokenCache.accessToken &&
    Date.now() + GSC_TOKEN_TTL_SKEW_MS < ga4TokenCache.expiresAt
  ) {
    return ga4TokenCache.accessToken;
  }

  const body = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: oauth.refreshToken,
    grant_type: 'refresh_token',
  });

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResponse.ok) {
    let details = null;
    try {
      details = await tokenResponse.json();
    } catch {
      details = null;
    }
    const message =
      details &&
      typeof details.error_description === 'string' &&
      details.error_description
        ? details.error_description
        : 'Failed to obtain GA4 OAuth access token via refresh token.';
    throw new Error(message);
  }

  const tokenPayload = await tokenResponse.json();
  const accessToken =
    tokenPayload && typeof tokenPayload.access_token === 'string'
      ? tokenPayload.access_token
      : '';
  const expiresIn =
    tokenPayload && typeof tokenPayload.expires_in === 'number'
      ? tokenPayload.expires_in
      : 3600;

  if (!accessToken) {
    throw new Error('OAuth token response did not include access_token.');
  }

  ga4TokenCache.accessToken = accessToken;
  ga4TokenCache.expiresAt = Date.now() + expiresIn * 1000;
  return accessToken;
};

const getGa4AccessTokenFromServiceAccount = async () => {
  if (
    ga4TokenCache.accessToken &&
    Date.now() + GSC_TOKEN_TTL_SKEW_MS < ga4TokenCache.expiresAt
  ) {
    return ga4TokenCache.accessToken;
  }

  const { clientEmail, privateKey } = getGoogleServiceAccountCredentials();
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Invalid service account JSON. Missing client_email or private_key.'
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: GA4_SCOPE,
    aud: GOOGLE_OAUTH_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(privateKey);
  const assertion = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const tokenResponse = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResponse.ok) {
    let details = null;
    try {
      details = await tokenResponse.json();
    } catch {
      details = null;
    }
    const message =
      details &&
      typeof details.error_description === 'string' &&
      details.error_description
        ? details.error_description
        : 'Failed to obtain Google Analytics access token.';
    throw new Error(message);
  }

  const tokenPayload = await tokenResponse.json();
  const accessToken =
    tokenPayload && typeof tokenPayload.access_token === 'string'
      ? tokenPayload.access_token
      : '';
  const expiresIn =
    tokenPayload && typeof tokenPayload.expires_in === 'number'
      ? tokenPayload.expires_in
      : 3600;

  if (!accessToken) {
    throw new Error('Google OAuth token response did not include access_token.');
  }

  ga4TokenCache.accessToken = accessToken;
  ga4TokenCache.expiresAt = Date.now() + expiresIn * 1000;
  return accessToken;
};

const getGa4AccessToken = async () => {
  const oauthToken = await getGa4AccessTokenFromOAuthRefreshToken();
  if (oauthToken) {
    return oauthToken;
  }
  return getGa4AccessTokenFromServiceAccount();
};

const isValidDateValue = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const defaultGscDateRange = () => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 29);
  return { startDate: toISODate(startDate), endDate: toISODate(endDate) };
};

const parseCsvQueryParam = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const buildGscSummary = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };
  }

  const totals = rows.reduce(
    (acc, row) => {
      const clicks = parseNumber(row?.clicks);
      const impressions = parseNumber(row?.impressions);
      const ctr = parseNumber(row?.ctr);
      const position = parseNumber(row?.position);
      return {
        clicks: acc.clicks + clicks,
        impressions: acc.impressions + impressions,
        weightedCtr: acc.weightedCtr + ctr * impressions,
        weightedPosition: acc.weightedPosition + position * impressions,
      };
    },
    { clicks: 0, impressions: 0, weightedCtr: 0, weightedPosition: 0 }
  );

  const denominator = totals.impressions || rows.length;
  const ctr = totals.impressions
    ? totals.weightedCtr / totals.impressions
    : totals.weightedCtr / rows.length;
  const position = totals.impressions
    ? totals.weightedPosition / totals.impressions
    : totals.weightedPosition / rows.length;

  return {
    clicks: Math.round(totals.clicks),
    impressions: Math.round(totals.impressions),
    ctr: Number(ctr.toFixed(4)),
    position: Number(position.toFixed(2)),
    denominator,
  };
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

const isPageSpeedKeyConfigurationError = (status, message) => {
  if (status !== 403 || typeof message !== 'string') return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes('pagespeed insights api has not been used') ||
    normalized.includes('pagespeed insights api has not been used in project') ||
    normalized.includes('pagespeedonline.googleapis.com') ||
    normalized.includes('is disabled')
  );
};

const fetchPageSpeedApi = async ({ pageUrl, strategy, apiKey }) => {
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
    const error = new Error(
      apiMessage || `PageSpeed API failed for ${strategy} (${response.status}).`
    );
    error.status = response.status;
    error.apiMessage = apiMessage;
    throw error;
  }
  return response.json();
};

const fetchPageSpeedStrategy = async ({ pageUrl, strategy, apiKey }) => {
  try {
    const data = await fetchPageSpeedApi({ pageUrl, strategy, apiKey });
    return buildPageSpeedPayload(strategy, data);
  } catch (error) {
    if (
      apiKey &&
      isPageSpeedKeyConfigurationError(error.status, error.apiMessage)
    ) {
      const fallbackData = await fetchPageSpeedApi({ pageUrl, strategy });
      return buildPageSpeedPayload(strategy, fallbackData);
    }
    throw error;
  }
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
    const apiKeyAlias = (requestUrl.searchParams.get('apiKeyAlias') || '')
      .trim()
      .toLowerCase();
    const aliasKeyEnvName = apiKeyAlias
      ? `${apiKeyAlias.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_PAGESPEED_API_KEY`
      : '';
    const apiKey = (
      (aliasKeyEnvName ? process.env[aliasKeyEnvName] : '') ||
      process.env.PAGESPEED_API_KEY ||
      ''
    ).trim();

    if (!pageUrl) {
      sendJson(res, 400, {
        error:
          'Unsupported client or invalid url. Provide a supported ?client (e.g. little-sicily, walker-advisor) or a valid ?url=',
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

  if (requestUrl.pathname === '/api/gsc/traffic' && req.method === 'GET') {
    const client = (requestUrl.searchParams.get('client') || 'walker-advisor')
      .trim()
      .toLowerCase();
    const configuredSiteUrl = (process.env.GSC_SITE_URL || '').trim();
    const siteUrl =
      (requestUrl.searchParams.get('siteUrl') || '').trim() ||
      configuredSiteUrl ||
      GSC_CLIENT_SITE_URLS[client] ||
      '';
    const { startDate: defaultStartDate, endDate: defaultEndDate } =
      defaultGscDateRange();
    const startDate =
      (requestUrl.searchParams.get('startDate') || '').trim() || defaultStartDate;
    const endDate =
      (requestUrl.searchParams.get('endDate') || '').trim() || defaultEndDate;
    const dimensions = parseCsvQueryParam(
      requestUrl.searchParams.get('dimensions') || 'date'
    );
    const rowLimitRaw = parseNumber(requestUrl.searchParams.get('rowLimit'));
    const rowLimit = rowLimitRaw > 0 ? Math.min(Math.round(rowLimitRaw), 25000) : 1000;
    const searchType = (requestUrl.searchParams.get('searchType') || 'web')
      .trim()
      .toLowerCase();

    if (!siteUrl) {
      sendJson(res, 400, {
        error:
          'Missing siteUrl. Set GSC_SITE_URL in .env or pass ?siteUrl=sc-domain:thewalkeradvisor.com',
      });
      return;
    }
    if (!isValidDateValue(startDate) || !isValidDateValue(endDate)) {
      sendJson(res, 400, {
        error: 'Invalid date format. Use YYYY-MM-DD for startDate and endDate.',
      });
      return;
    }
    if (startDate > endDate) {
      sendJson(res, 400, { error: 'startDate cannot be after endDate.' });
      return;
    }

    try {
      const accessToken = await getGscAccessToken();
      const queryResponse = await fetch(
        `${GSC_BASE_URL}/sites/${encodeURIComponent(
          siteUrl
        )}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions,
            rowLimit,
            searchType,
          }),
        }
      );

      if (!queryResponse.ok) {
        let details = null;
        try {
          details = await queryResponse.json();
        } catch {
          details = null;
        }
        const apiMessage =
          details &&
          details.error &&
          typeof details.error.message === 'string'
            ? details.error.message
            : `Search Console API failed (${queryResponse.status}).`;
        sendJson(res, queryResponse.status, {
          error: apiMessage,
          details,
        });
        return;
      }

      const data = await queryResponse.json();
      const rows = Array.isArray(data?.rows) ? data.rows : [];
      sendJson(res, 200, {
        source: 'google-search-console',
        client,
        siteUrl,
        startDate,
        endDate,
        dimensions,
        searchType,
        rowLimit,
        summary: buildGscSummary(rows),
        rows,
      });
    } catch (error) {
      sendJson(res, 500, {
        error: formatGoogleFetchError(error, 'Google Search Console'),
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/google-analytics/overview' && req.method === 'GET') {
    const client = (requestUrl.searchParams.get('client') || 'walker-advisor')
      .trim()
      .toLowerCase();
    const clientConfig = GA4_CLIENTS[client] || {
      propertyIdEnv: 'GA4_PROPERTY_ID',
    };

    const defaultRange = defaultDateRange();
    const startDate = requestUrl.searchParams.get('startDate') || defaultRange.since;
    const endDate = requestUrl.searchParams.get('endDate') || defaultRange.until;
    const propertyId = (
      process.env[clientConfig.propertyIdEnv] ||
      process.env.GA4_PROPERTY_ID ||
      ''
    ).trim();

    if (!propertyId) {
      sendJson(res, 400, {
        error: `Set ${clientConfig.propertyIdEnv} (or GA4_PROPERTY_ID) in backend .env.`,
      });
      return;
    }

    if (!isValidDateValue(startDate) || !isValidDateValue(endDate)) {
      sendJson(res, 400, {
        error: 'Invalid date format. Use YYYY-MM-DD for startDate and endDate.',
      });
      return;
    }
    if (startDate > endDate) {
      sendJson(res, 400, { error: 'startDate cannot be after endDate.' });
      return;
    }

    const cacheKey = `ga4:${client}:${propertyId}:${startDate}:${endDate}`;
    const cached = overviewCache.get(cacheKey);
    if (cached && Date.now() - cached.at < OVERVIEW_CACHE_TTL_MS) {
      sendJson(res, 200, cached.payload);
      return;
    }

    try {
      const accessToken = await getGa4AccessToken();
      const propertyPath = `properties/${propertyId}`;

      const runGaReport = async (body) => {
        const reportResponse = await fetch(
          `${GA4_BASE_URL}/${propertyPath}:runReport`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (!reportResponse.ok) {
          let details = null;
          try {
            details = await reportResponse.json();
          } catch {
            details = null;
          }
          const apiMessage =
            details &&
            details.error &&
            typeof details.error.message === 'string'
              ? details.error.message
              : `GA4 API failed (${reportResponse.status}).`;
          throw new Error(apiMessage);
        }
        return reportResponse.json();
      };

      const [summaryReport, pagesReport, channelsReport] = await Promise.all([
        runGaReport({
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'newUsers' },
            { name: 'engagedSessions' },
            { name: 'engagementRate' },
            { name: 'averageSessionDuration' },
            { name: 'screenPageViews' },
            { name: 'eventCount' },
          ],
        }),
        runGaReport({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'engagementRate' },
          ],
          orderBys: [
            {
              metric: { metricName: 'screenPageViews' },
              desc: true,
            },
          ],
          limit: 10,
        }),
        runGaReport({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'engagedSessions' },
            { name: 'screenPageViews' },
          ],
          orderBys: [
            {
              metric: { metricName: 'sessions' },
              desc: true,
            },
          ],
          limit: 8,
        }),
      ]);

      const summaryValues = Array.isArray(summaryReport?.rows)
        ? summaryReport.rows[0]?.metricValues || []
        : [];
      const payload = {
        source: 'google-analytics-data-api',
        client,
        propertyId,
        dateRange: { startDate, endDate },
        summary: {
          sessions: parseNumber(summaryValues?.[0]?.value),
          totalUsers: parseNumber(summaryValues?.[1]?.value),
          newUsers: parseNumber(summaryValues?.[2]?.value),
          engagedSessions: parseNumber(summaryValues?.[3]?.value),
          engagementRate: parseNumber(summaryValues?.[4]?.value),
          averageSessionDuration: parseNumber(summaryValues?.[5]?.value),
          pageViews: parseNumber(summaryValues?.[6]?.value),
          eventCount: parseNumber(summaryValues?.[7]?.value),
        },
        topPages: (pagesReport?.rows || []).map((row) => ({
          pagePath: row?.dimensionValues?.[0]?.value || '(not set)',
          pageViews: parseNumber(row?.metricValues?.[0]?.value),
          sessions: parseNumber(row?.metricValues?.[1]?.value),
          users: parseNumber(row?.metricValues?.[2]?.value),
          engagementRate: parseNumber(row?.metricValues?.[3]?.value),
        })),
        channels: (channelsReport?.rows || []).map((row) => ({
          channel: row?.dimensionValues?.[0]?.value || '(not set)',
          sessions: parseNumber(row?.metricValues?.[0]?.value),
          users: parseNumber(row?.metricValues?.[1]?.value),
          engagedSessions: parseNumber(row?.metricValues?.[2]?.value),
          pageViews: parseNumber(row?.metricValues?.[3]?.value),
        })),
      };

      overviewCache.set(cacheKey, { at: Date.now(), payload });
      sendJson(res, 200, payload);
    } catch (error) {
      sendJson(res, 500, {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected Google Analytics API error.',
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/facebook-ads/overview' && req.method === 'GET') {
    const client = (requestUrl.searchParams.get('client') || 'walker-advisor')
      .trim()
      .toLowerCase();
    const clientConfig = FACEBOOK_ADS_CLIENTS[client];
    if (!clientConfig) {
      sendJson(res, 400, { error: 'Unsupported client.' });
      return;
    }

    const range = defaultDateRange();
    const since = requestUrl.searchParams.get('since') || range.since;
    const until = requestUrl.searchParams.get('until') || range.until;

    const accessToken = (
      process.env.FACEBOOK_ACCESS_TOKEN ||
      process.env.INSTAGRAM_ACCESS_TOKEN ||
      process.env.REACT_APP_FB_ACCESS_TOKEN ||
      ''
    ).trim();
    const legacyAdAccountFallback =
      client === 'walker-advisor'
        ? process.env.REACT_APP_WALKER_AD_ACCOUNT_ID || ''
        : '';
    const legacyPageFallback =
      client === 'walker-advisor' ? process.env.REACT_APP_WALKER_PAGE_ID || '' : '';
    const rawAdAccountId = (
      process.env[clientConfig.adAccountIdEnv] ||
      legacyAdAccountFallback ||
      ''
    ).trim();
    const adAccountId = rawAdAccountId.replace(/^act_/i, '');
    const facebookPageId = (
      process.env[clientConfig.facebookPageIdEnv] ||
      legacyPageFallback ||
      ''
    ).trim();
    const graphVersion =
      process.env.FACEBOOK_GRAPH_VERSION ||
      process.env.INSTAGRAM_GRAPH_VERSION ||
      'v20.0';

    if (!accessToken) {
      sendJson(res, 400, {
        error:
          'Set FACEBOOK_ACCESS_TOKEN (or INSTAGRAM_ACCESS_TOKEN) in backend .env.',
      });
      return;
    }

    if (!adAccountId) {
      sendJson(res, 400, {
        error: `Set ${clientConfig.adAccountIdEnv} in backend .env.`,
      });
      return;
    }

    const cacheKey = `fb-ads:${client}:${since}:${until}`;
    const cached = overviewCache.get(cacheKey);
    if (cached && Date.now() - cached.at < OVERVIEW_CACHE_TTL_MS) {
      sendJson(res, 200, cached.payload);
      return;
    }

    try {
      const adsUrl = buildGraphUrl(
        `${graphVersion}/act_${adAccountId}/insights`,
        {
          fields: 'ad_id,campaign_name,impressions,clicks,spend,actions',
          level: 'ad',
          limit: '100',
          time_increment: 'all_days',
          time_range: JSON.stringify({ since, until }),
        },
        accessToken
      );
      const adsResponse = await fetch(adsUrl);
      if (!adsResponse.ok) {
        await relayMetaError(res, adsResponse, 'Facebook Ads API');
        return;
      }
      const adsData = await adsResponse.json();

      const getActionValue = (actions, actionType) => {
        if (!Array.isArray(actions)) return 0;
        return actions
          .filter((action) => action?.action_type === actionType)
          .reduce((total, action) => total + parseNumber(action?.value), 0);
      };

      const mappedCampaigns = Array.isArray(adsData?.data)
        ? adsData.data.map((row, index) => ({
            id: row?.ad_id || `campaign-${index}`,
            source: 'facebook',
            campaign: row?.campaign_name || 'Untitled Campaign',
            impressions: parseNumber(row?.impressions),
            clicks: parseNumber(row?.clicks),
            amountSpent: parseNumber(row?.spend),
            postEngagement: getActionValue(row?.actions, 'post_engagement'),
          }))
        : [];

      const adCampaigns = clientConfig.filterWalkerCampaigns
        ? mappedCampaigns.filter((row) => isWalkerCampaignName(row.campaign))
        : mappedCampaigns;

      let pageLikes = 0;
      let pageImpressions = 0;
      let pageEngagement = 0;
      let pageReach = 0;
      let organicPosts = [];
      if (facebookPageId) {
        const pageUrl = buildGraphUrl(
          `${graphVersion}/${facebookPageId}`,
          { fields: 'fan_count' },
          accessToken
        );
        const pagePostsUrl = buildGraphUrl(
          `${graphVersion}/${facebookPageId}/posts`,
          {
            fields: 'id,message,created_time',
            limit: '25',
            since,
            until,
          },
          accessToken
        );
        const pageInsightsUrl = buildGraphUrl(
          `${graphVersion}/${facebookPageId}/insights`,
          {
            metric: 'page_impressions,page_engaged_users,page_reach',
            period: 'day',
            since,
            until,
          },
          accessToken
        );

        const [pageResponse, pagePostsResponse, pageInsightsResponse] = await Promise.all([
          fetch(pageUrl),
          fetch(pagePostsUrl),
          fetch(pageInsightsUrl),
        ]);

        if (pageResponse.ok) {
          const pageData = await pageResponse.json();
          pageLikes = parseNumber(pageData?.fan_count);
        }

        if (pageInsightsResponse.ok) {
          const insightsData = await pageInsightsResponse.json();
          pageImpressions = getInsightMetricTotal(insightsData, 'page_impressions');
          pageEngagement = getInsightMetricTotal(insightsData, 'page_engaged_users');
          pageReach = getInsightMetricTotal(insightsData, 'page_reach');
        }

        if (pagePostsResponse.ok) {
          const pagePostsData = await pagePostsResponse.json();
          const posts = Array.isArray(pagePostsData?.data) ? pagePostsData.data : [];

          const postInsightRows = await Promise.all(
            posts.map(async (post, index) => {
              const postId = post?.id;
              const fallbackCampaign =
                (post?.message || '').slice(0, 70) || `Facebook post ${index + 1}`;
              if (!postId) {
                return {
                  id: `fb-post-${index}`,
                  source: 'facebook',
                  campaign: fallbackCampaign,
                  impressions: 0,
                  clicks: 0,
                  amountSpent: 0,
                  postEngagement: 0,
                };
              }
              try {
                const postInsightsUrl = buildGraphUrl(
                  `${graphVersion}/${postId}/insights`,
                  {
                    metric: 'post_impressions,post_engaged_users,post_clicks',
                  },
                  accessToken
                );
                const postInsightsResponse = await fetch(postInsightsUrl);
                if (!postInsightsResponse.ok) {
                  return {
                    id: postId,
                    source: 'facebook',
                    campaign: fallbackCampaign,
                    impressions: 0,
                    clicks: 0,
                    amountSpent: 0,
                    postEngagement: 0,
                  };
                }
                const postInsightsData = await postInsightsResponse.json();
                return {
                  id: postId,
                  source: 'facebook',
                  campaign: fallbackCampaign,
                  impressions: getInsightMetricTotal(
                    postInsightsData,
                    'post_impressions'
                  ),
                  clicks: getInsightMetricTotal(postInsightsData, 'post_clicks'),
                  amountSpent: 0,
                  postEngagement: getInsightMetricTotal(
                    postInsightsData,
                    'post_engaged_users'
                  ),
                };
              } catch {
                return {
                  id: postId,
                  source: 'facebook',
                  campaign: fallbackCampaign,
                  impressions: 0,
                  clicks: 0,
                  amountSpent: 0,
                  postEngagement: 0,
                };
              }
            })
          );

          organicPosts = postInsightRows;
        }
      }

      const campaigns = [...adCampaigns, ...organicPosts];

      const totalImpressions = campaigns.reduce(
        (sum, item) => sum + item.impressions,
        0
      );
      const totalPostEngagement = campaigns.reduce(
        (sum, item) => sum + item.postEngagement,
        0
      );

      const payload = {
        dateRange: { since, until },
        campaigns,
        summary: {
          source: 'facebook',
          pageId: facebookPageId || `act_${adAccountId}`,
          impressions: pageImpressions || totalImpressions,
          postEngagement: totalPostEngagement,
          pageEngagement: pageEngagement || totalPostEngagement,
          pageLikes,
          reach: pageReach || Math.round(totalImpressions * 0.7),
        },
      };
      overviewCache.set(cacheKey, { at: Date.now(), payload });
      sendJson(res, 200, payload);
    } catch (error) {
      sendJson(res, 500, {
        error:
          error instanceof Error ? error.message : 'Unexpected Facebook Ads API error.',
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/youtube/overview' && req.method === 'GET') {
    const client = (requestUrl.searchParams.get('client') || 'walker-advisor')
      .trim()
      .toLowerCase();
    const clientConfig = YOUTUBE_CLIENTS[client];
    if (!clientConfig) {
      sendJson(res, 400, { error: 'Unsupported client.' });
      return;
    }

    const range = defaultDateRange();
    const since = requestUrl.searchParams.get('since') || range.since;
    const until = requestUrl.searchParams.get('until') || range.until;
    const untilExclusive = addDaysToISODate(until, 1);

    const apiKey = (
      process.env.YOUTUBE_API_KEY ||
      process.env.REACT_APP_YOUTUBE_API_KEY ||
      ''
    ).trim();
    const channelId = (
      process.env[clientConfig.channelIdEnv] || ''
    ).trim();

    if (!apiKey) {
      sendJson(res, 400, {
        error: 'Set YOUTUBE_API_KEY in backend .env.',
      });
      return;
    }
    if (!channelId) {
      sendJson(res, 400, {
        error: `Set ${clientConfig.channelIdEnv} in backend .env.`,
      });
      return;
    }

    const cacheKey = `youtube:${client}:${since}:${until}`;
    const cached = overviewCache.get(cacheKey);
    if (cached && Date.now() - cached.at < OVERVIEW_CACHE_TTL_MS) {
      sendJson(res, 200, cached.payload);
      return;
    }

    try {
      const channelParams = new URLSearchParams({
        part: 'snippet,statistics',
        id: channelId,
        key: apiKey,
      });
      const channelResponse = await fetch(
        `${YOUTUBE_BASE_URL}/channels?${channelParams.toString()}`
      );
      if (!channelResponse.ok) {
        sendJson(res, channelResponse.status, {
          error: `YouTube channel API failed (${channelResponse.status}).`,
        });
        return;
      }
      const channelData = await channelResponse.json();
      const channelItem = Array.isArray(channelData?.items)
        ? channelData.items[0]
        : null;

      const searchParams = new URLSearchParams({
        part: 'id,snippet',
        channelId,
        order: 'date',
        type: 'video',
        maxResults: '25',
        publishedAfter: `${since}T00:00:00Z`,
        publishedBefore: `${untilExclusive}T00:00:00Z`,
        key: apiKey,
      });
      const searchResponse = await fetch(
        `${YOUTUBE_BASE_URL}/search?${searchParams.toString()}`
      );
      if (!searchResponse.ok) {
        sendJson(res, searchResponse.status, {
          error: `YouTube search API failed (${searchResponse.status}).`,
        });
        return;
      }
      const searchData = await searchResponse.json();
      const searchItems = Array.isArray(searchData?.items) ? searchData.items : [];
      const videoIds = searchItems
        .map((item) => item?.id?.videoId)
        .filter((id) => typeof id === 'string' && id);

      let videoStatsById = new Map();
      if (videoIds.length > 0) {
        const videosParams = new URLSearchParams({
          part: 'statistics,snippet',
          id: videoIds.join(','),
          key: apiKey,
        });
        const videosResponse = await fetch(
          `${YOUTUBE_BASE_URL}/videos?${videosParams.toString()}`
        );
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          const videosItems = Array.isArray(videosData?.items)
            ? videosData.items
            : [];
          videoStatsById = new Map(videosItems.map((item) => [item.id, item]));
        }
      }

      const videos = searchItems.map((item, index) => {
        const videoId = item?.id?.videoId || `video-${index}`;
        const statsItem = videoStatsById.get(videoId);
        const stats = statsItem?.statistics || {};
        const title =
          (statsItem?.snippet?.title || item?.snippet?.title || '').trim() ||
          `YouTube Video ${index + 1}`;
        const views = parseNumber(stats.viewCount);
        const likes = parseNumber(stats.likeCount);
        const comments = parseNumber(stats.commentCount);
        return {
          id: videoId,
          source: 'youtube',
          title,
          publishedAt:
            statsItem?.snippet?.publishedAt || item?.snippet?.publishedAt || '',
          views,
          likes,
          comments,
          engagement: likes + comments,
        };
      });

      const payload = {
        dateRange: { since, until },
        channel: {
          id: channelItem?.id || channelId,
          title: channelItem?.snippet?.title || 'YouTube Channel',
          subscribers: parseNumber(channelItem?.statistics?.subscriberCount),
          totalViews: parseNumber(channelItem?.statistics?.viewCount),
          totalVideos: parseNumber(channelItem?.statistics?.videoCount),
        },
        summary: {
          videosPublished: videos.length,
          views: videos.reduce((sum, item) => sum + item.views, 0),
          likes: videos.reduce((sum, item) => sum + item.likes, 0),
          comments: videos.reduce((sum, item) => sum + item.comments, 0),
          engagement: videos.reduce((sum, item) => sum + item.engagement, 0),
        },
        videos,
      };

      overviewCache.set(cacheKey, { at: Date.now(), payload });
      sendJson(res, 200, payload);
    } catch (error) {
      sendJson(res, 500, {
        error:
          error instanceof Error ? error.message : 'Unexpected YouTube API error.',
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
