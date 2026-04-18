/**
 * Dashboard API (runs on port 5000).
 *
 * Env vars:
 *   INSTAGRAM_ACCESS_TOKEN       - Fallback Meta access token with instagram_basic, pages_read_engagement
 *   FACEBOOK_ACCESS_TOKEN        - Fallback Meta access token for Facebook + Instagram endpoints
 *   WALKER_ADVISOR_META_ACCESS_TOKEN / TALKEARLYED_META_ACCESS_TOKEN / PARTY_HALL_META_ACCESS_TOKEN
 *                                - Preferred per-client Meta access tokens
 *   BECKLEY_PARTYHALL_IG_USER_ID - Instagram *Business* account ID (numeric). Use this if you have it.
 *   FACEBOOK_PAGE_ID             - Optional. If set and IG User ID is missing, we resolve Page -> Instagram Business Account.
 *   PAGESPEED_API_KEY            - Optional Google PageSpeed Insights API key.
 */

// data
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

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
const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';
const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1';
const STRIPE_WEBHOOK_TOLERANCE_SECONDS = 300;
const SUBSCRIPTIONS_STORE_PATH = path.resolve(__dirname, 'subscriptions.store.json');
const NEWSLETTER_STORE_PATH = path.resolve(__dirname, 'newsletter.store.json');
const HR_PROFILES_STORE_PATH = path.resolve(__dirname, 'hr-profiles.store.json');
const HR_CV_UPLOADS_DIR = path.resolve(__dirname, 'uploads', 'hr-cvs');
const MONGODB_URI = (process.env.MONGODB_URI || '').trim();
const MONGODB_DB_NAME = (process.env.MONGODB_DB_NAME || 'aimarklabs').trim();
const MONGODB_HR_PROFILES_COLLECTION = (
  process.env.MONGODB_HR_PROFILES_COLLECTION || 'hr_profiles'
).trim();
const CLOUDFLARE_ACCOUNT_ID = (process.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
const CLOUDFLARE_IMAGES_API_TOKEN = (process.env.CLOUDFLARE_IMAGES_API_TOKEN || '').trim();
const CLOUDFLARE_IMAGES_ACCOUNT_HASH = (
  process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || ''
).trim();
let mongoClientPromise = null;

const normalizeAvailabilityLabel = (availability, status) => {
  const normalizedAvailability = String(availability || '').trim();

  if (normalizedAvailability) return normalizedAvailability;

  return String(status || '').trim().toLowerCase() === 'inactive'
    ? 'Check with HR'
    : 'Available now';
};

const sanitizeFileName = (value, fallbackBaseName = 'file') => {
  const extension = path.extname(String(value || '')).toLowerCase();
  const baseName = path.basename(String(value || ''), extension);
  const safeBaseName = String(baseName || fallbackBaseName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallbackBaseName;

  return `${safeBaseName}${extension || ''}`;
};

const ensureHrCvUploadsDir = () => {
  fs.mkdirSync(HR_CV_UPLOADS_DIR, { recursive: true });
};

const saveHrCvFile = ({ fileName, buffer }) => {
  ensureHrCvUploadsDir();
  const safeFileName = sanitizeFileName(fileName, 'cv');
  const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const filePath = path.join(HR_CV_UPLOADS_DIR, uniqueFileName);
  fs.writeFileSync(filePath, buffer);
  return {
    fileName: safeFileName,
    storedFileName: uniqueFileName,
    cvUrl: `/uploads/hr-cvs/${uniqueFileName}`,
  };
};

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
const MONTHLY_PLAN_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const monthlyPlanCache = new Map();
const INSTAGRAM_CLIENTS = {
  'party-hall': {
    igUserIdEnv: 'BECKLEY_PARTYHALL_IG_USER_ID',
    facebookPageIdEnv: 'FACEBOOK_PAGE_ID',
    metaAccessTokenEnv: 'PARTY_HALL_META_ACCESS_TOKEN',
    includeFacebook: true,
  },
  'walker-advisor': {
    igUserIdEnv: 'WALKER_ADVISOR_IG_USER_ID',
    facebookPageIdEnv: 'WALKER_ADVISOR_FACEBOOK_PAGE_ID',
    metaAccessTokenEnv: 'WALKER_ADVISOR_META_ACCESS_TOKEN',
    includeFacebook: false,
  },
  talkearlyed: {
    igUserIdEnv: 'TALKEARLYED_IG_USER_ID',
    facebookPageIdEnv: 'TALKEARLYED_FACEBOOK_PAGE_ID',
    metaAccessTokenEnv: 'TALKEARLYED_META_ACCESS_TOKEN',
    includeFacebook: true,
  },
};
const FACEBOOK_ADS_CLIENTS = {
  'walker-advisor': {
    adAccountIdEnv: 'WALKER_ADVISOR_AD_ACCOUNT_ID',
    facebookPageIdEnv: 'WALKER_ADVISOR_FACEBOOK_PAGE_ID',
    metaAccessTokenEnv: 'WALKER_ADVISOR_META_ACCESS_TOKEN',
    filterWalkerCampaigns: true,
  },
  talkearlyed: {
    adAccountIdEnv: 'TALKEARLYED_AD_ACCOUNT_ID',
    facebookPageIdEnv: 'TALKEARLYED_FACEBOOK_PAGE_ID',
    metaAccessTokenEnv: 'TALKEARLYED_META_ACCESS_TOKEN',
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
  talkearlyed: (
    process.env.TALKEARLYED_SITE_URL || 'https://talkearlyed.com/'
  ).trim(),
  'walker-advisor': 'https://thewalkeradvisor.com/',
};
const GSC_CLIENT_SITE_URLS = {
  'walker-advisor': (
    process.env.WALKER_ADVISOR_GSC_SITE_URL || 'sc-domain:thewalkeradvisor.com'
  ).trim(),
  eyeapp: (
    process.env.GETTHEEYEAPP_GSC_SITE_URL || 'sc-domain:gettheeyeapp.com'
  ).trim(),
  talkearlyed: (
    process.env.TALKEARLYED_GSC_SITE_URL || 'https://talkearlyed.com/'
  ).trim(),
};
const GA4_CLIENTS = {
  'walker-advisor': {
    propertyIdEnv: 'WALKER_ADVISOR_GA4_PROPERTY_ID',
  },
  talkearlyed: {
    propertyIdEnv: 'TALKEARLYED_GA4_PROPERTY_ID',
  },
};
const GSC_TOKEN_TTL_SKEW_MS = 60 * 1000;
const gscTokenCacheByMode = {
  oauth: { accessToken: '', expiresAt: 0 },
  serviceAccount: { accessToken: '', expiresAt: 0 },
};
const ga4TokenCache = { accessToken: '', expiresAt: 0 };

const resolveMetaAccessToken = (preferredEnvKey) => {
  const candidates = [
    preferredEnvKey,
    'FACEBOOK_ACCESS_TOKEN',
    'INSTAGRAM_ACCESS_TOKEN',
    'REACT_APP_FB_ACCESS_TOKEN',
  ].filter(Boolean);

  for (const envKey of candidates) {
    const token = (process.env[envKey] || '').trim();
    if (token) {
      return { token, envKey };
    }
  }

  return { token: '', envKey: preferredEnvKey || candidates[0] || '' };
};

const resolveCorsOrigin = (origin) => {
  const fallback = '*';
  if (!origin || typeof origin !== 'string') return fallback;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return fallback;
  }
};

const sendJson = (res, statusCode, payload, origin) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': resolveCorsOrigin(origin),
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
    Vary: 'Origin',
  });
  res.end(JSON.stringify(payload));
};

const readRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      chunks.push(chunk);
      size += chunk.length;
      if (size > 2 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (error) => reject(error));
  });

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 10 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
      }
    });
    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', (error) => reject(error));
  });

const readSubscriptionsStore = () => {
  try {
    const raw = fs.readFileSync(SUBSCRIPTIONS_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSubscriptionsStore = (rows) => {
  fs.writeFileSync(SUBSCRIPTIONS_STORE_PATH, JSON.stringify(rows, null, 2));
};

const readNewsletterStore = () => {
  try {
    const raw = fs.readFileSync(NEWSLETTER_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeNewsletterStore = (rows) => {
  fs.writeFileSync(NEWSLETTER_STORE_PATH, JSON.stringify(rows, null, 2));
};

const readHrProfilesStore = () => {
  try {
    const raw = fs.readFileSync(HR_PROFILES_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeHrProfilesStore = (rows) => {
  fs.writeFileSync(HR_PROFILES_STORE_PATH, JSON.stringify(rows, null, 2));
};

const getMongoClient = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  if (!mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    mongoClientPromise = client.connect();
  }

  return mongoClientPromise;
};

const getHrProfilesCollection = async () => {
  const client = await getMongoClient();
  return client.db(MONGODB_DB_NAME).collection(MONGODB_HR_PROFILES_COLLECTION);
};

const readHrProfiles = async () => {
  if (!MONGODB_URI) {
    return readHrProfilesStore();
  }

  const collection = await getHrProfilesCollection();
  const rows = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1, id: 1 })
    .toArray();

  return Array.isArray(rows) ? rows : [];
};

const writeHrProfiles = async (rows) => {
  if (!MONGODB_URI) {
    writeHrProfilesStore(rows);
    return rows;
  }

  const collection = await getHrProfilesCollection();
  await collection.deleteMany({});

  if (rows.length > 0) {
    await collection.insertMany(
      rows.map((row, index) => ({
        ...row,
        order: index,
        updatedAt: new Date().toISOString(),
        createdAt:
          typeof row?.createdAt === 'string' && row.createdAt.trim()
            ? row.createdAt.trim()
            : new Date().toISOString(),
      }))
    );
  }

  return readHrProfiles();
};

const createNewsletterTransporter = () => {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || '587');
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  if (!host || !user || !pass || !Number.isFinite(port)) {
    return null;
  }

  const secure =
    String(process.env.SMTP_SECURE || 'false')
      .trim()
      .toLowerCase() === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

const sendNewsletterSubscriptionEmails = async (subscriberEmail) => {
  const transporter = createNewsletterTransporter();
  if (!transporter) return;

  const fromEmail =
    (process.env.NEWSLETTER_FROM_EMAIL || process.env.SMTP_USER || '').trim();
  if (!fromEmail) return;

  const adminRecipients = (process.env.NEWSLETTER_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const subscribedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (adminRecipients.length > 0) {
    await transporter.sendMail({
      from: fromEmail,
      to: adminRecipients.join(','),
      subject: 'New Newsletter Subscription',
      text: `A new newsletter subscription was received.\n\nEmail: ${subscriberEmail}\nTime: ${subscribedAt}`,
    });
  }

  await transporter.sendMail({
    from: fromEmail,
    to: subscriberEmail,
    subject: 'Newsletter Subscription Confirmed',
    text: 'Thanks for subscribing to AI Mark Labs newsletter. We will share updates with you soon.',
  });
};

const listSubscriptionsByEmail = (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail) return [];
  return readSubscriptionsStore().filter(
    (row) => String(row?.email || '').trim().toLowerCase() === normalizedEmail
  );
};

const saveSubscriptionsForCheckout = ({
  email,
  sessionId,
  items,
  paymentPreference,
  createdAtUnix,
}) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!normalizedEmail || !Array.isArray(items) || items.length === 0) return;
  const createdAtMs =
    typeof createdAtUnix === 'number' && Number.isFinite(createdAtUnix)
      ? createdAtUnix * 1000
      : Date.now();
  const nextPaymentDate = new Date(createdAtMs);
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
  const nextPayment = nextPaymentDate.toISOString().slice(0, 10);
  const status =
    paymentPreference === 'bank' ? 'Pending Bank Approval' : 'Active';

  const current = readSubscriptionsStore();
  const nonDuplicate = current.filter(
    (row) =>
      !(
        String(row?.email || '').trim().toLowerCase() === normalizedEmail &&
        String(row?.sourceSessionId || '') === String(sessionId || '')
      )
  );

  const mapped = items.map((item, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    email: normalizedEmail,
    name: String(item.name || `Package ${index + 1}`),
    status,
    nextPayment,
    total: `$${(parseNumber(item.priceCents) / 100).toFixed(2)} / month`,
    sourceSessionId: String(sessionId || ''),
    createdAt: new Date(createdAtMs).toISOString(),
  }));

  writeSubscriptionsStore([...mapped, ...nonDuplicate]);
};

const parseStripeSignatureHeader = (signatureHeader) => {
  const parts = String(signatureHeader || '').split(',');
  const parsed = { t: '', v1: '' };
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    if (key === 't') parsed.t = value || '';
    if (key === 'v1') parsed.v1 = value || '';
  });
  return parsed;
};

const verifyStripeWebhookSignature = ({
  rawBodyBuffer,
  signatureHeader,
  webhookSecret,
}) => {
  const { t, v1 } = parseStripeSignatureHeader(signatureHeader);
  if (!t || !v1) return false;
  const timestamp = Number.parseInt(t, 10);
  if (!Number.isFinite(timestamp)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > STRIPE_WEBHOOK_TOLERANCE_SECONDS) return false;
  const signedPayload = `${timestamp}.${rawBodyBuffer.toString('utf8')}`;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
};

const fetchStripeSessionLineItems = async ({ secretKey, sessionId }) => {
  const response = await fetch(
    `${STRIPE_API_BASE_URL}/checkout/sessions/${encodeURIComponent(
      sessionId
    )}/line_items?limit=100`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );
  const payload = await response.json();
  if (!response.ok) {
    const message =
      payload &&
      payload.error &&
      typeof payload.error.message === 'string'
        ? payload.error.message
        : `Stripe line items API failed (${response.status}).`;
    throw new Error(message);
  }
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows.map((row, index) => ({
    name: String(row?.description || `Package ${index + 1}`),
    quantity: parseNumber(row?.quantity) || 1,
    priceCents: parseNumber(row?.amount_subtotal) || parseNumber(row?.amount_total) || 0,
  }));
};

const resolveAllowedOrigin = (origin) => {
  const fallback = 'http://localhost:3000';
  if (!origin || typeof origin !== 'string') return fallback;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return fallback;
  }
};

const centsFromDollars = (value) => {
  const parsed = parseNumber(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
};

const createStripeCheckoutSession = async ({
  secretKey,
  items,
  customerEmail,
  invoiceNumber,
  preferredPaymentMethod,
  successUrl,
  cancelUrl,
}) => {
  const params = new URLSearchParams();
  params.set('mode', 'subscription');
  params.set('success_url', successUrl);
  params.set('cancel_url', cancelUrl);
  if (customerEmail) {
    params.set('customer_email', customerEmail);
  }
  if (invoiceNumber) {
    params.set('metadata[invoice_number]', invoiceNumber);
  }
  if (preferredPaymentMethod) {
    params.set('metadata[payment_preference]', preferredPaymentMethod);
  }

  items.forEach((item, index) => {
    const amountCents = centsFromDollars(item.price);
    if (amountCents <= 0) return;
    const name = String(item.name || `Package ${index + 1}`).trim() || `Package ${index + 1}`;
    params.set(`line_items[${index}][price_data][currency]`, 'usd');
    params.set(`line_items[${index}][price_data][unit_amount]`, String(amountCents));
    params.set(`line_items[${index}][price_data][product_data][name]`, name);
    params.set(`line_items[${index}][price_data][recurring][interval]`, 'month');
    params.set(`line_items[${index}][quantity]`, '1');
  });

  const response = await fetch(`${STRIPE_API_BASE_URL}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const payload = await response.json();
  if (!response.ok) {
    const message =
      payload &&
      payload.error &&
      typeof payload.error.message === 'string'
        ? payload.error.message
        : `Stripe API failed (${response.status}).`;
    throw new Error(message);
  }
  return payload;
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

const parsePageIdFromStoryId = (value) => {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.includes('_')) return text.split('_')[0].trim();
  return '';
};

const getAdCreativePageId = (adRow) => {
  const storySpec = adRow?.creative?.object_story_spec || {};
  const storySpecPageId = String(storySpec?.page_id || '').trim();
  if (storySpecPageId) return storySpecPageId;

  const effectiveStoryId = String(
    adRow?.creative?.effective_object_story_id || adRow?.effective_object_story_id || ''
  ).trim();
  return parsePageIdFromStoryId(effectiveStoryId);
};

const parseAdAccountId = (value) =>
  String(value || '')
    .trim()
    .replace(/^act_/i, '');

const discoverMetaAdAccountId = async (graphVersion, accessToken) => {
  try {
    const adAccountsUrl = buildGraphUrl(
      `${graphVersion}/me/adaccounts`,
      {
        fields: 'id,name,account_status',
        limit: '25',
      },
      accessToken
    );
    const response = await fetch(adAccountsUrl);
    if (!response.ok) return '';
    const data = await response.json();
    const rows = Array.isArray(data?.data) ? data.data : [];
    const firstValid = rows.find((row) => parseAdAccountId(row?.id));
    return firstValid ? parseAdAccountId(firstValid.id) : '';
  } catch {
    return '';
  }
};

const discoverManagedPageWithInstagram = async (graphVersion, accessToken) => {
  try {
    const pagesUrl = buildGraphUrl(
      `${graphVersion}/me/accounts`,
      {
        fields: 'id,name,fan_count,instagram_business_account{id}',
        limit: '50',
      },
      accessToken
    );
    const response = await fetch(pagesUrl);
    if (!response.ok) return null;
    const data = await response.json();
    const rows = Array.isArray(data?.data) ? data.data : [];
    const withInstagram = rows.find(
      (row) => row?.instagram_business_account?.id
    );
    return withInstagram || rows[0] || null;
  } catch {
    return null;
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

const roundMetric = (value, digits = 2) => {
  const parsed = parseNumber(value);
  if (!Number.isFinite(parsed)) return 0;
  const factor = 10 ** digits;
  return Math.round(parsed * factor) / factor;
};

const safeRatio = (numerator, denominator, digits = 2) => {
  const num = parseNumber(numerator);
  const den = parseNumber(denominator);
  if (!den) return 0;
  return roundMetric((num / den) * 100, digits);
};

const pickTopItems = (items, limit, mapper) =>
  (Array.isArray(items) ? items : [])
    .slice(0, limit)
    .map((item, index) => mapper(item, index))
    .filter(Boolean);

const createMonthlyPlanFallback = ({ client, brandLabel, analyticsSnapshot, generatedAt }) => {
  const siteHealth = analyticsSnapshot?.siteHealth;
  const gsc = analyticsSnapshot?.searchConsole;
  const ga4 = analyticsSnapshot?.googleAnalytics;
  const meta = analyticsSnapshot?.metaAnalytics;
  const youtube = analyticsSnapshot?.youtube;

  const mobilePerformance = parseNumber(
    siteHealth?.strategies?.mobile?.coreWebVitals?.performanceScore
  );
  const desktopPerformance = parseNumber(
    siteHealth?.strategies?.desktop?.coreWebVitals?.performanceScore
  );
  const organicClicks = parseNumber(gsc?.summary?.clicks);
  const organicImpressions = parseNumber(gsc?.summary?.impressions);
  const organicCtr = roundMetric((gsc?.summary?.ctr || 0) * 100, 2);
  const avgPosition = roundMetric(gsc?.summary?.position || 0, 2);
  const sessions = parseNumber(ga4?.summary?.sessions);
  const users = parseNumber(ga4?.summary?.totalUsers);
  const pageViews = parseNumber(ga4?.summary?.pageViews);
  const engagementRate = roundMetric((ga4?.summary?.engagementRate || 0) * 100, 2);
  const metaImpressions = parseNumber(meta?.summary?.impressions);
  const metaReach = parseNumber(meta?.summary?.reach);
  const metaEngagement = parseNumber(meta?.summary?.postEngagement || meta?.summary?.pageEngagement);
  const videosPublished = parseNumber(youtube?.summary?.videosPublished);
  const youtubeViews = parseNumber(youtube?.summary?.views);

  const performanceSummary = [
    mobilePerformance ? `Mobile performance score ${mobilePerformance}/100` : '',
    desktopPerformance ? `desktop performance ${desktopPerformance}/100` : '',
    organicClicks ? `${organicClicks} organic clicks from ${organicImpressions} impressions` : '',
    sessions ? `${sessions} sessions across ${users || sessions} users` : '',
    metaImpressions ? `${metaImpressions} paid/social impressions with ${metaEngagement} engagements` : '',
    videosPublished ? `${videosPublished} new videos generated ${youtubeViews} views` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const topPages = pickTopItems(ga4?.topPages, 3, (item) => {
    const pagePath = String(item?.pagePath || '').trim();
    if (!pagePath) return null;
    return `${pagePath} (${parseNumber(item?.pageViews)} views)`;
  });

  const topChannels = pickTopItems(ga4?.channels, 3, (item) => {
    const channel = String(item?.channel || '').trim();
    if (!channel) return null;
    return `${channel} (${parseNumber(item?.sessions)} sessions)`;
  });

  const actionItems = [
    mobilePerformance && mobilePerformance < 70
      ? 'Improve mobile performance by compressing heavy media, reducing blocking scripts, and tightening page payload size.'
      : 'Maintain current site speed by keeping image sizes compressed and monitoring new scripts before release.',
    organicCtr && organicCtr < 3
      ? 'Rewrite page titles and meta descriptions for priority pages to improve click-through rate from search results.'
      : 'Expand existing high-performing search pages with stronger internal linking and conversion-oriented CTAs.',
    sessions && engagementRate < 50
      ? 'Refresh landing page messaging and above-the-fold calls-to-action to convert current traffic more efficiently.'
      : 'Double down on channels already generating qualified sessions and replicate content themes that retain users.',
    metaImpressions
      ? 'Use Meta creative learnings to produce one stronger winning offer, then rotate fresh visuals to prevent fatigue.'
      : 'Launch or reconnect a social/ad reporting source so campaign learnings feed the monthly plan automatically.',
  ];

  return {
    source: 'fallback',
    model: 'deterministic-summary',
    generatedAt,
    brandLabel,
    client,
    title: `${brandLabel} Monthly Growth Plan`,
    summary:
      performanceSummary ||
      `${brandLabel} monthly plan generated from the latest available analytics sources.`,
    highlights: [
      organicClicks
        ? `${organicClicks} search clicks with ${organicCtr}% average CTR and position ${avgPosition}.`
        : 'Search Console data is limited or unavailable right now.',
      sessions
        ? `${sessions} sessions and ${pageViews} page views were recorded in the current reporting window.`
        : 'Google Analytics data is limited or unavailable right now.',
      topChannels.length > 0
        ? `Top acquisition channels: ${topChannels.join(', ')}.`
        : 'Channel mix is not available yet.',
    ],
    priorities: [
      mobilePerformance && mobilePerformance < 70
        ? 'Technical performance recovery, especially mobile speed and core web vitals.'
        : 'Protect site performance while scaling traffic and landing page conversion.',
      organicClicks
        ? 'Organic search growth through content expansion, metadata improvements, and internal linking.'
        : 'Enable search reporting and build an SEO baseline for next month.',
      metaImpressions || videosPublished
        ? 'Scale the strongest social/content themes into repeatable weekly campaigns.'
        : 'Reconnect campaign and content channels so planning is based on complete funnel data.',
    ],
    actionItems,
    opportunities: [
      topPages.length > 0
        ? `Expand or repurpose the top pages already attracting attention: ${topPages.join(', ')}.`
        : 'Identify the top-performing landing pages and use them as the baseline for next month content.',
      metaReach
        ? `Retarget users reached on Meta (${metaReach}) with a stronger conversion-specific offer.`
        : 'Add retargeting or remarketing audiences once paid/social traffic is available.',
      videosPublished
        ? 'Turn high-interest video topics into blog, reel, and email formats to extend reach.'
        : 'Repurpose existing best-performing blog or page topics into short-form social content.',
    ],
    risks: [
      mobilePerformance && mobilePerformance < 60
        ? 'Low mobile performance can suppress rankings and reduce lead conversion.'
        : 'Performance can regress quickly if new landing pages are added without optimization checks.',
      organicCtr && organicCtr < 2
        ? 'Low organic CTR suggests weak SERP messaging even if impressions are healthy.'
        : 'Search visibility growth may stall without fresh keyword-targeted pages.',
      !metaImpressions && !videosPublished
        ? 'Missing social or content channel data limits full-funnel planning quality.'
        : 'Channel saturation or creative fatigue can reduce efficiency if creatives are not refreshed.',
    ],
  };
};

const requestOpenAiMonthlyPlan = async ({ client, brandLabel, analyticsSnapshot, generatedAt }) => {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return createMonthlyPlanFallback({ client, brandLabel, analyticsSnapshot, generatedAt });
  }

  const model = (
    process.env.OPENAI_MONTHLY_PLAN_MODEL ||
    process.env.OPENAI_MODEL ||
    'gpt-4.1-mini'
  ).trim();

  const response = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You generate concise monthly marketing plans from analytics. Return valid JSON only with keys: title, summary, highlights, priorities, actionItems, opportunities, risks. Each list must contain 3 to 5 short strings. Keep claims grounded in the provided analytics only.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Create an auto-updating monthly plan for the dashboard.',
            client,
            brandLabel,
            generatedAt,
            analyticsSnapshot,
          }),
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const apiError =
      payload?.error?.message ||
      `OpenAI request failed with status ${response.status}.`;
    throw new Error(apiError);
  }

  const rawContent = payload?.choices?.[0]?.message?.content;
  const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : null;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('OpenAI did not return a valid monthly plan payload.');
  }

  const ensureList = (value) =>
    (Array.isArray(value) ? value : [])
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .slice(0, 5);

  return {
    source: 'openai',
    model,
    generatedAt,
    brandLabel,
    client,
    title: String(parsed.title || `${brandLabel} Monthly Growth Plan`).trim(),
    summary: String(parsed.summary || '').trim(),
    highlights: ensureList(parsed.highlights),
    priorities: ensureList(parsed.priorities),
    actionItems: ensureList(parsed.actionItems),
    opportunities: ensureList(parsed.opportunities),
    risks: ensureList(parsed.risks),
  };
};

const buildPageSpeedUrlCandidates = (pageUrl) => {
  const normalized = normalizePageUrl(pageUrl);
  if (!normalized) return [];

  const candidates = [normalized];

  try {
    const parsed = new URL(normalized);
    const hostnameWithoutWww = parsed.hostname.replace(/^www\./i, '');
    const alternateHostnames = parsed.hostname.startsWith('www.')
      ? [hostnameWithoutWww]
      : [`www.${hostnameWithoutWww}`];
    const alternateProtocols =
      parsed.protocol === 'https:' ? [] : ['https:'];

    alternateHostnames.forEach((hostname) => {
      const hostVariant = new URL(parsed.toString());
      hostVariant.hostname = hostname;
      candidates.push(hostVariant.toString());

      alternateProtocols.forEach((protocol) => {
        const secureVariant = new URL(hostVariant.toString());
        secureVariant.protocol = protocol;
        candidates.push(secureVariant.toString());
      });
    });

    alternateProtocols.forEach((protocol) => {
      const secureVariant = new URL(parsed.toString());
      secureVariant.protocol = protocol;
      candidates.push(secureVariant.toString());
    });
  } catch {
    return candidates;
  }

  return [...new Set(candidates)];
};

const extractFirstTagValue = (xml, tagName) => {
  const match = String(xml || '').match(
    new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  );
  return match ? match[1].trim() : '';
};

const decodeXmlEntities = (value) =>
  String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const extractSitemapEntries = (xmlText) => {
  const xml = String(xmlText || '');
  const sitemapMatches = [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/gi)];
  if (sitemapMatches.length > 0) {
    return sitemapMatches
      .map((match) => ({
        type: 'sitemap',
        loc: decodeXmlEntities(extractFirstTagValue(match[1], 'loc')),
        lastmod: extractFirstTagValue(match[1], 'lastmod'),
      }))
      .filter((entry) => entry.loc);
  }

  const urlMatches = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  return urlMatches
    .map((match) => ({
      type: 'url',
      loc: decodeXmlEntities(extractFirstTagValue(match[1], 'loc')),
      lastmod: extractFirstTagValue(match[1], 'lastmod'),
    }))
    .filter((entry) => entry.loc);
};

const isDateWithinRange = (value, startDate, endDate) => {
  const isoDate = String(value || '').slice(0, 10);
  if (!isValidDateValue(isoDate)) return false;
  return isoDate >= startDate && isoDate <= endDate;
};

const buildWebsiteBaseUrl = (value) => {
  const normalized = normalizePageUrl(value);
  if (!normalized) return '';
  try {
    const parsed = new URL(normalized);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return '';
  }
};

const fetchWebsiteBlogSummary = async ({ websiteUrl, startDate, endDate }) => {
  const baseUrl = buildWebsiteBaseUrl(websiteUrl);
  if (!baseUrl) {
    return {
      source: 'unavailable',
      websiteUrl,
      blogsPublishedThisMonth: 0,
      totalIndexedBlogs: 0,
      recentBlogUrls: [],
    };
  }

  const candidates = [`${baseUrl}/sitemap.xml`, `${baseUrl}/post-sitemap.xml`];
  const visited = new Set();
  const queue = [...candidates];
  const urlEntries = [];

  while (queue.length > 0 && visited.size < 10) {
    const currentUrl = queue.shift();
    if (!currentUrl || visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const response = await fetch(currentUrl);
      if (!response.ok) continue;
      const xmlText = await response.text();
      const entries = extractSitemapEntries(xmlText);
      entries.forEach((entry) => {
        if (entry.type === 'sitemap') {
          if (!visited.has(entry.loc) && queue.length < 20) {
            queue.push(entry.loc);
          }
          return;
        }
        urlEntries.push(entry);
      });
    } catch {
      // Ignore unavailable sitemap candidates.
    }
  }

  const uniqueBlogEntries = Array.from(
    new Map(
      urlEntries
        .filter((entry) => {
          try {
            const parsed = new URL(entry.loc);
            return /\/blog(s)?(\/|$)/i.test(parsed.pathname);
          } catch {
            return false;
          }
        })
        .map((entry) => [entry.loc, entry])
    ).values()
  );

  const recentBlogEntries = uniqueBlogEntries.filter((entry) =>
    isDateWithinRange(entry.lastmod, startDate, endDate)
  );

  return {
    source: uniqueBlogEntries.length > 0 ? 'sitemap' : 'unavailable',
    websiteUrl: baseUrl,
    blogsPublishedThisMonth: recentBlogEntries.length,
    totalIndexedBlogs: uniqueBlogEntries.length,
    recentBlogUrls: recentBlogEntries.slice(0, 5).map((entry) => entry.loc),
  };
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

const hasGscServiceAccountConfig = () => {
  const inlineJson = (process.env.GSC_SERVICE_ACCOUNT_JSON || '').trim();
  const credentialsPath = (
    process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
  ).trim();
  return Boolean(inlineJson || credentialsPath);
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
    const apiErrorCode =
      details && typeof details.error === 'string' ? details.error : '';
    const apiErrorDescription =
      details && typeof details.error_description === 'string'
        ? details.error_description
        : '';
    const message =
      apiErrorCode || apiErrorDescription
        ? `Google OAuth refresh token failed (${apiErrorCode || 'unknown'}): ${
            apiErrorDescription || 'No error_description returned.'
          }`
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
  try {
    const oauthToken = await getGscAccessTokenFromOAuthRefreshToken();
    if (oauthToken) {
      return oauthToken;
    }
  } catch (error) {
    if (!hasGscServiceAccountConfig()) {
      throw error;
    }
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

const getGa4PropertyIdForClient = (client) => {
  const clientConfig = GA4_CLIENTS[client] || { propertyIdEnv: 'GA4_PROPERTY_ID' };
  return (
    process.env[clientConfig.propertyIdEnv] ||
    process.env.GA4_PROPERTY_ID ||
    ''
  ).trim();
};

const mapGa4BacklinkRows = (reportRows) => {
  if (!Array.isArray(reportRows)) return [];
  return reportRows
    .map((row) => {
      const dimensions = Array.isArray(row?.dimensionValues)
        ? row.dimensionValues
        : [];
      const metrics = Array.isArray(row?.metricValues) ? row.metricValues : [];
      const source = String(dimensions[0]?.value || '').trim();
      const target = String(dimensions[1]?.value || '').trim();
      const sessions = Math.round(parseNumber(metrics[0]?.value));
      if (!source || source === '(direct)' || source === '(not set)') return null;
      return {
        source,
        target: target || '/',
        sessions: sessions > 0 ? sessions : 0,
      };
    })
    .filter(Boolean);
};

const runGa4Report = async ({ accessToken, propertyId, body }) => {
  const propertyPath = `properties/${propertyId}`;
  const response = await fetch(`${GA4_BASE_URL}/${propertyPath}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

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
        : `GA4 API failed (${response.status}).`;
    throw new Error(apiMessage);
  }

  return response.json();
};

const fetchGa4Backlinks = async ({ client, startDate, endDate }) => {
  const propertyId = getGa4PropertyIdForClient(client);
  if (!propertyId) return [];

  const accessToken = await getGa4AccessToken();
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const wideEndDate = toISODate(now);
  const wideStart = new Date(now);
  wideStart.setDate(wideStart.getDate() - 364);
  const wideStartDate = toISODate(wideStart);

  const baseBody = {
    dimensions: [{ name: 'sessionSource' }, { name: 'landingPagePlusQueryString' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  };
  const rangesToTry = [
    { startDate, endDate },
    { startDate: wideStartDate, endDate: wideEndDate },
  ];

  for (const range of rangesToTry) {
    const referralReport = await runGa4Report({
      accessToken,
      propertyId,
      body: {
        ...baseBody,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionMedium',
            stringFilter: {
              matchType: 'EXACT',
              value: 'referral',
            },
          },
        },
      },
    });
    const referralRows = mapGa4BacklinkRows(referralReport?.rows);
    if (referralRows.length > 0) {
      return referralRows;
    }

    const fallbackReport = await runGa4Report({
      accessToken,
      propertyId,
      body: {
        ...baseBody,
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      },
    });
    const fallbackRows = mapGa4BacklinkRows(fallbackReport?.rows);
    if (fallbackRows.length > 0) {
      return fallbackRows;
    }
  }

  return [];
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

const isRetryablePageSpeedDocumentError = (message) => {
  if (typeof message !== 'string') return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes('failed_document_request') ||
    normalized.includes('err_timed_out') ||
    normalized.includes('err_name_not_resolved') ||
    normalized.includes('err_connection_timed_out') ||
    normalized.includes('err_connection_refused')
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
  const urlCandidates = buildPageSpeedUrlCandidates(pageUrl);
  let lastError = null;

  for (let index = 0; index < urlCandidates.length; index += 1) {
    const candidateUrl = urlCandidates[index];

    try {
      const data = await fetchPageSpeedApi({
        pageUrl: candidateUrl,
        strategy,
        apiKey,
      });
      return buildPageSpeedPayload(strategy, data);
    } catch (error) {
      if (
        apiKey &&
        isPageSpeedKeyConfigurationError(error.status, error.apiMessage)
      ) {
        try {
          const fallbackData = await fetchPageSpeedApi({
            pageUrl: candidateUrl,
            strategy,
          });
          return buildPageSpeedPayload(strategy, fallbackData);
        } catch (fallbackError) {
          lastError = fallbackError;
        }
      } else {
        lastError = error;
      }

      if (
        index === urlCandidates.length - 1 ||
        !isRetryablePageSpeedDocumentError(
          lastError?.apiMessage || lastError?.message
        )
      ) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error(`PageSpeed API failed for ${strategy}.`);
};

const requestHandler = async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {}, req.headers.origin);
    return;
  }

  if (requestUrl.pathname.startsWith('/uploads/hr-cvs/') && req.method === 'GET') {
    const requestedFileName = decodeURIComponent(
      requestUrl.pathname.replace('/uploads/hr-cvs/', '')
    );
    const safeFileName = path.basename(requestedFileName);
    const filePath = path.join(HR_CV_UPLOADS_DIR, safeFileName);

    if (!safeFileName || !fs.existsSync(filePath)) {
      sendJson(res, 404, { error: 'CV file not found.' }, req.headers.origin);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safeFileName}"`,
      'Access-Control-Allow-Origin': resolveCorsOrigin(req.headers.origin),
      Vary: 'Origin',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  if (requestUrl.pathname === '/') {
    sendJson(res, 200, {
      ok: true,
      service: 'aimarklabs-backend',
      routes: [
        '/health',
        '/api/instagram/overview',
        '/api/facebook-ads/overview',
        '/api/google-analytics/overview',
        '/api/gsc/traffic',
        '/api/site-health/overview',
        '/api/content/website-summary',
        '/api/monthly-plan/generate',
        '/api/payments/stripe/checkout-session',
        '/api/payments/stripe/webhook',
        '/api/subscriptions',
        '/api/newsletter/subscribe',
        '/api/hr/profiles',
        '/api/hr/upload-cv',
        '/api/cloudflare/images/direct-upload',
        '/api/youtube/overview',
      ],
    });
    return;
  }

  if (requestUrl.pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (requestUrl.pathname === '/api/content/website-summary' && req.method === 'GET') {
    const client = (requestUrl.searchParams.get('client') || '').trim().toLowerCase();
    const websiteUrl = normalizePageUrl(
      requestUrl.searchParams.get('url') || SITE_HEALTH_CLIENT_URLS[client] || ''
    );
    const today = toISODate(new Date());
    const monthStart = `${today.slice(0, 8)}01`;
    const startDate = (requestUrl.searchParams.get('startDate') || monthStart).trim();
    const endDate = (requestUrl.searchParams.get('endDate') || today).trim();

    if (!websiteUrl) {
      sendJson(
        res,
        400,
        { error: 'Missing website url. Pass ?url= or configure a client site URL.' },
        req.headers.origin
      );
      return;
    }

    try {
      const payload = await fetchWebsiteBlogSummary({
        websiteUrl,
        startDate,
        endDate,
      });
      sendJson(
        res,
        200,
        {
          client,
          startDate,
          endDate,
          ...payload,
        },
        req.headers.origin
      );
    } catch (error) {
      sendJson(
        res,
        500,
        {
          error:
            error instanceof Error ? error.message : 'Unable to load website content summary.',
        },
        req.headers.origin
      );
    }
    return;
  }

  if (requestUrl.pathname === '/api/monthly-plan/generate' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const client = String(body?.client || 'unknown-client')
        .trim()
        .toLowerCase();
      const brandLabel =
        String(body?.brandLabel || body?.client || 'Client').trim() || 'Client';
      const analyticsSnapshot =
        body?.analyticsSnapshot && typeof body.analyticsSnapshot === 'object'
          ? body.analyticsSnapshot
          : {};
      const fingerprint = crypto
        .createHash('sha1')
        .update(JSON.stringify({ client, brandLabel, analyticsSnapshot }))
        .digest('hex');
      const cached = monthlyPlanCache.get(fingerprint);
      if (cached && Date.now() - cached.at < MONTHLY_PLAN_CACHE_TTL_MS) {
        sendJson(res, 200, { ...cached.payload, cached: true }, req.headers.origin);
        return;
      }

      const generatedAt = new Date().toISOString();
      let report = null;

      try {
        report = await requestOpenAiMonthlyPlan({
          client,
          brandLabel,
          analyticsSnapshot,
          generatedAt,
        });
      } catch (error) {
        console.error('Monthly plan AI generation failed. Falling back.', {
          client,
          message: error instanceof Error ? error.message : String(error),
        });
        report = createMonthlyPlanFallback({
          client,
          brandLabel,
          analyticsSnapshot,
          generatedAt,
        });
      }

      const payload = {
        ok: true,
        cached: false,
        report,
      };
      monthlyPlanCache.set(fingerprint, { at: Date.now(), payload });
      sendJson(res, 200, payload, req.headers.origin);
    } catch (error) {
      sendJson(
        res,
        400,
        {
          error:
            error instanceof Error
              ? error.message
              : 'Unable to generate monthly plan.',
        },
        req.headers.origin
      );
    }
    return;
  }

  if (requestUrl.pathname === '/api/hr/profiles' && req.method === 'GET') {
    try {
      const status = String(requestUrl.searchParams.get('status') || '')
        .trim()
        .toLowerCase();
      const rows = await readHrProfiles();
      const filteredRows =
        status === 'active' || status === 'inactive'
          ? rows.filter(
              (row) => String(row?.status || '').trim().toLowerCase() === status
            )
          : rows;

      sendJson(
        res,
        200,
        {
          source: MONGODB_URI ? 'mongodb' : 'local-file-store',
          rows: filteredRows,
        },
        req.headers.origin
      );
    } catch (error) {
      console.error('Unable to fetch HR profiles from MongoDB.', error);
      const fallbackRows = readHrProfilesStore();
      const status = String(requestUrl.searchParams.get('status') || '')
        .trim()
        .toLowerCase();
      const filteredFallbackRows =
        status === 'active' || status === 'inactive'
          ? fallbackRows.filter(
              (row) => String(row?.status || '').trim().toLowerCase() === status
            )
          : fallbackRows;

      sendJson(
        res,
        200,
        {
          source: 'local-file-store-fallback',
          warning:
            error instanceof Error ? error.message : 'Unable to fetch HR profiles from MongoDB.',
          rows: filteredFallbackRows,
        },
        req.headers.origin
      );
    }
    return;
  }

  if (requestUrl.pathname === '/api/cloudflare/images/direct-upload' && req.method === 'POST') {
    try {
      if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN || !CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
        sendJson(
          res,
          400,
          {
            error:
              'Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_IMAGES_API_TOKEN, and CLOUDFLARE_IMAGES_ACCOUNT_HASH in backend env.',
          },
          req.headers.origin
        );
        return;
      }

      const body = await readJsonBody(req);
      const baseName = String(body?.fileName || 'profile-image')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-|-$/g, '');
      const creator = String(body?.creator || 'hr-dashboard').trim() || 'hr-dashboard';

      const formData = new FormData();
      formData.append('requireSignedURLs', 'false');
      formData.append(
        'metadata',
        JSON.stringify({
          source: 'hr-dashboard',
          fileName: baseName,
        })
      );
      formData.append('creator', creator);

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
          },
          body: formData,
        }
      );

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.result?.uploadURL || !payload?.result?.id) {
        sendJson(
          res,
          response.ok ? 400 : response.status,
          {
            error:
              payload?.errors?.[0]?.message ||
              payload?.messages?.[0]?.message ||
              'Unable to create Cloudflare direct upload URL.',
          },
          req.headers.origin
        );
        return;
      }

      sendJson(
        res,
        200,
        {
          uploadURL: payload.result.uploadURL,
          imageId: payload.result.id,
          imageURL: `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${payload.result.id}/public`,
        },
        req.headers.origin
      );
    } catch (error) {
      sendJson(
        res,
        500,
        {
          error: error instanceof Error ? error.message : 'Unable to upload image.',
        },
        req.headers.origin
      );
    }
    return;
  }

  if (requestUrl.pathname === '/api/hr/upload-cv' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const fileName = String(body?.fileName || 'cv.pdf').trim();
      const fileDataUrl = String(body?.fileDataUrl || '').trim();
      const dataUrlMatch = fileDataUrl.match(/^data:(application\/pdf);base64,(.+)$/i);

      if (!dataUrlMatch) {
        sendJson(res, 400, { error: 'Only PDF files are supported.' }, req.headers.origin);
        return;
      }

      const upload = saveHrCvFile({
        fileName: fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`,
        buffer: Buffer.from(dataUrlMatch[2], 'base64'),
      });

      sendJson(
        res,
        200,
        {
          fileName: upload.fileName,
          cvUrl: upload.cvUrl,
        },
        req.headers.origin
      );
    } catch (error) {
      sendJson(
        res,
        500,
        {
          error: error instanceof Error ? error.message : 'Unable to upload CV PDF.',
        },
        req.headers.origin
      );
    }
    return;
  }

  if (requestUrl.pathname === '/api/hr/profiles' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const rows = Array.isArray(body?.profiles) ? body.profiles : null;

      if (!rows) {
        sendJson(res, 400, { message: 'Profiles array is required.' }, req.headers.origin);
        return;
      }

      const normalizedRows = rows.map((row, index) => {
        const normalizedStatus =
          String(row?.status || '').trim().toLowerCase() === 'inactive'
            ? 'inactive'
            : 'active';

        return {
          id:
            typeof row?.id === 'string' && row.id.trim()
              ? row.id.trim()
              : `${Date.now()}-${index}`,
          name: String(row?.name || '').trim(),
          role: String(row?.role || '').trim(),
          module: String(row?.module || '').trim(),
          country: String(row?.country || '').trim(),
          state: String(row?.state || '').trim(),
          experienceLevel: String(row?.experienceLevel || row?.experience || '').trim(),
          status: normalizedStatus,
          description: String(row?.description || '').trim(),
          image: String(row?.image || '').trim(),
          skills: Array.isArray(row?.skills)
            ? row.skills
                .map((skill) => String(skill || '').trim())
                .filter(Boolean)
            : [],
          availability: normalizeAvailabilityLabel(row?.availability, normalizedStatus),
          location: String(row?.location || '').trim(),
          linkedinUrl: String(row?.linkedinUrl || '').trim(),
          portfolioUrl: String(row?.portfolioUrl || '').trim(),
          cvUrl: String(row?.cvUrl || '').trim(),
          cvFileName: String(row?.cvFileName || '').trim(),
          cvText: String(row?.cvText || '').trim(),
          allowedClientEmails: Array.isArray(row?.allowedClientEmails)
            ? row.allowedClientEmails
                .map((entry) => String(entry || '').trim().toLowerCase())
                .filter(Boolean)
            : [],
          experiences: Array.isArray(row?.experiences)
            ? row.experiences
                .map((entry) => ({
                  title: String(entry?.title || '').trim(),
                  company: String(entry?.company || '').trim(),
                  duration: String(entry?.duration || '').trim(),
                }))
                .filter((entry) => entry.title || entry.company || entry.duration)
            : (() => {
                const title = String(row?.previousRole || '').trim();
                const company = String(row?.previousCompany || '').trim();
                return title || company ? [{ title, company, duration: '' }] : [];
              })(),
        };
      });

      const savedRows = await writeHrProfiles(normalizedRows);
      sendJson(
        res,
        200,
        {
          message: 'HR profiles saved successfully.',
          source: MONGODB_URI ? 'mongodb' : 'local-file-store',
          rows: savedRows,
        },
        req.headers.origin
      );
    } catch (error) {
      sendJson(res, 400, {
        message: error instanceof Error ? error.message : 'Unable to save HR profiles.',
      }, req.headers.origin);
    }
    return;
  }

  if (requestUrl.pathname === '/api/newsletter/subscribe' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const email = String(body?.email || '')
        .trim()
        .toLowerCase();

      if (!email) {
        sendJson(res, 400, { message: 'Email is required.' });
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        sendJson(res, 400, { message: 'Please enter a valid email address.' });
        return;
      }

      const existingRows = readNewsletterStore();
      const alreadyExists = existingRows.some(
        (row) => row && typeof row === 'object' && String(row.email || '') === email
      );

      if (!alreadyExists) {
        const nextRows = [
          ...existingRows,
          {
            email,
            subscribedAt: new Date().toISOString(),
          },
        ];
        writeNewsletterStore(nextRows);
      }

      try {
        await sendNewsletterSubscriptionEmails(email);
      } catch (mailError) {
        console.error(
          '[newsletter] Unable to send email notifications:',
          mailError instanceof Error ? mailError.message : mailError
        );
      }

      sendJson(res, 200, { message: 'Subscription recorded successfully.' });
    } catch (error) {
      sendJson(res, 400, {
        message: error instanceof Error ? error.message : 'Unable to process subscription.',
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/subscriptions' && req.method === 'GET') {
    const email = (requestUrl.searchParams.get('email') || '').trim().toLowerCase();
    if (!email) {
      sendJson(res, 400, { error: 'Missing email query parameter.' });
      return;
    }
    sendJson(res, 200, {
      source: 'local-store',
      email,
      rows: listSubscriptionsByEmail(email),
    });
    return;
  }

  if (requestUrl.pathname === '/api/payments/stripe/webhook' && req.method === 'POST') {
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    const stripeWebhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
    if (!stripeSecretKey || !stripeWebhookSecret) {
      sendJson(res, 400, {
        error: 'Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in backend .env.',
      });
      return;
    }

    try {
      const rawBody = await readRawBody(req);
      const signatureHeader = req.headers['stripe-signature'];
      const valid = verifyStripeWebhookSignature({
        rawBodyBuffer: rawBody,
        signatureHeader,
        webhookSecret: stripeWebhookSecret,
      });
      if (!valid) {
        sendJson(res, 400, { error: 'Invalid Stripe webhook signature.' });
        return;
      }

      const event = JSON.parse(rawBody.toString('utf8'));
      if (event?.type === 'checkout.session.completed') {
        const session = event?.data?.object || {};
        const sessionId = String(session?.id || '');
        const email = String(session?.customer_email || '').trim().toLowerCase();
        const paymentPreference = String(
          session?.metadata?.payment_preference || 'card'
        ).trim();
        if (sessionId && email) {
          const lineItems = await fetchStripeSessionLineItems({
            secretKey: stripeSecretKey,
            sessionId,
          });
          saveSubscriptionsForCheckout({
            email,
            sessionId,
            items: lineItems,
            paymentPreference,
            createdAtUnix: parseNumber(session?.created),
          });
        }
      }

      sendJson(res, 200, { received: true });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Stripe webhook processing failed.',
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/payments/stripe/checkout-session' && req.method === 'POST') {
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeSecretKey) {
      sendJson(res, 400, {
        error: 'Set STRIPE_SECRET_KEY in backend .env before using Stripe checkout.',
      });
      return;
    }

    try {
      const body = await readJsonBody(req);
      const itemsRaw = Array.isArray(body?.items) ? body.items : [];
      const items = itemsRaw
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          name: String(item.name || '').trim(),
          price: parseNumber(item.price),
        }))
        .filter((item) => item.name && item.price > 0);

      if (items.length === 0) {
        sendJson(res, 400, { error: 'At least one valid cart item is required.' });
        return;
      }

      const allowedOrigin = resolveAllowedOrigin(req.headers.origin);
      const successUrl = `${allowedOrigin}/dashboard?stripe=success`;
      const cancelUrl = `${allowedOrigin}/dashboard?stripe=cancel`;
      const customerEmail = String(body?.customerEmail || '').trim();
      const invoiceNumber = String(body?.invoiceNumber || '').trim();
      const preferredPaymentMethod = String(body?.preferredPaymentMethod || '').trim();

      const session = await createStripeCheckoutSession({
        secretKey: stripeSecretKey,
        items,
        customerEmail,
        invoiceNumber,
        preferredPaymentMethod,
        successUrl,
        cancelUrl,
      });

      sendJson(res, 200, {
        id: session.id || '',
        url: session.url || '',
      });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Unable to create Stripe checkout session.',
      });
    }
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
      const strategyResults = await Promise.allSettled(
        strategies.map((strategy) =>
          fetchPageSpeedStrategy({ pageUrl, strategy, apiKey })
        )
      );
      const strategyData = strategyResults
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
      const failures = strategyResults
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason);

      if (strategyData.length === 0) {
        throw failures[0] || new Error('PageSpeed API failed.');
      }

      const payload = {
        source: 'pagespeed-insights',
        client,
        url: pageUrl,
        fetchedAt: new Date().toISOString(),
        warnings: failures
          .map((failure) =>
            failure instanceof Error ? failure.message : 'Unable to load one strategy.'
          )
          .filter(Boolean),
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
    const clientSiteUrl = (GSC_CLIENT_SITE_URLS[client] || '').trim();
    const siteUrl =
      (requestUrl.searchParams.get('siteUrl') || '').trim() ||
      clientSiteUrl ||
      configuredSiteUrl ||
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
          'Missing siteUrl. Set client-specific *_GSC_SITE_URL (recommended), or GSC_SITE_URL, or pass ?siteUrl=',
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
      let backlinks = [];
      try {
        backlinks = await fetchGa4Backlinks({ client, startDate, endDate });
      } catch (backlinkError) {
        console.error('GA4 backlinks request failed', {
          client,
          startDate,
          endDate,
          message:
            backlinkError instanceof Error
              ? backlinkError.message
              : String(backlinkError),
        });
      }

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
        backlinks,
        rows,
      });
    } catch (error) {
      console.error('GSC traffic request failed', {
        client,
        siteUrl,
        startDate,
        endDate,
        message: error instanceof Error ? error.message : String(error),
      });
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
      const summaryRows = Array.isArray(summaryReport?.rows) ? summaryReport.rows.length : 0;
      const pagesRows = Array.isArray(pagesReport?.rows) ? pagesReport.rows.length : 0;
      const channelsRows = Array.isArray(channelsReport?.rows)
        ? channelsReport.rows.length
        : 0;
      const payload = {
        source: 'google-analytics-data-api',
        client,
        propertyId,
        dateRange: { startDate, endDate },
        debug: {
          propertyId,
          propertyIdEnv: clientConfig.propertyIdEnv,
          summaryRows,
          pagesRows,
          channelsRows,
          hasAnyRows: summaryRows > 0 || pagesRows > 0 || channelsRows > 0,
        },
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

    const metaTokenConfig = resolveMetaAccessToken(
      clientConfig.metaAccessTokenEnv
    );
    const accessToken = metaTokenConfig.token;
    const legacyAdAccountFallback =
      client === 'walker-advisor'
        ? process.env.REACT_APP_WALKER_AD_ACCOUNT_ID || ''
        : client === 'talkearlyed'
          ? process.env.REACT_APP_TALKEARLYED_AD_ACCOUNT_ID || ''
        : '';
    const legacyPageFallback =
      client === 'walker-advisor'
        ? process.env.REACT_APP_WALKER_PAGE_ID || ''
        : client === 'talkearlyed'
          ? process.env.REACT_APP_TALKEARLYED_PAGE_ID || ''
          : '';
    const rawAdAccountId = (
      process.env[clientConfig.adAccountIdEnv] ||
      legacyAdAccountFallback ||
      ''
    ).trim();
    let adAccountId = parseAdAccountId(rawAdAccountId);
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
          `Set ${clientConfig.metaAccessTokenEnv} (recommended) or FACEBOOK_ACCESS_TOKEN in backend .env.`,
      });
      return;
    }

    if (!adAccountId) {
      const discoveredAdAccountId = await discoverMetaAdAccountId(
        graphVersion,
        accessToken
      );
      if (discoveredAdAccountId) {
        adAccountId = discoveredAdAccountId;
      } else {
        sendJson(res, 400, {
          error: `Set ${clientConfig.adAccountIdEnv} in backend .env, or grant ads_read and ad account access to this token.`,
        });
        return;
      }
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
            kind: 'ad_campaign',
            campaign: row?.campaign_name || 'Untitled Campaign',
            impressions: parseNumber(row?.impressions),
            clicks: parseNumber(row?.clicks),
            amountSpent: parseNumber(row?.spend),
            postEngagement: getActionValue(row?.actions, 'post_engagement'),
            publishedAt: '',
          }))
        : [];

      let pageScopedAdCampaigns = mappedCampaigns;
      if (facebookPageId && mappedCampaigns.length > 0) {
        pageScopedAdCampaigns = [];
        try {
          const adsWithCreativeUrl = buildGraphUrl(
            `${graphVersion}/act_${adAccountId}/ads`,
            {
              fields: 'id,creative{object_story_spec,effective_object_story_id}',
              limit: '500',
            },
            accessToken
          );
          const adsWithCreativeResponse = await fetch(adsWithCreativeUrl);
          if (adsWithCreativeResponse.ok) {
            const adsWithCreativeData = await adsWithCreativeResponse.json();
            const creativeRows = Array.isArray(adsWithCreativeData?.data)
              ? adsWithCreativeData.data
              : [];
            const allowedAdIds = new Set(
              creativeRows
                .filter((adRow) => getAdCreativePageId(adRow) === facebookPageId)
                .map((adRow) => String(adRow?.id || '').trim())
                .filter(Boolean)
            );
            pageScopedAdCampaigns = mappedCampaigns.filter((row) =>
              allowedAdIds.has(String(row.id))
            );
          }
        } catch {
          // Keep scoped data empty when creative lookup fails so we never leak account-wide totals.
        }
      }

      const adCampaigns = clientConfig.filterWalkerCampaigns
        ? pageScopedAdCampaigns.filter((row) => isWalkerCampaignName(row.campaign))
        : pageScopedAdCampaigns;

      let pageLikes = 0;
      let pageImpressions = 0;
      let pageEngagement = 0;
      let pageReach = 0;
      let organicPosts = [];
      let pageInsightsFetched = false;
      let pageInsightsError = '';
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
          pageInsightsFetched = true;
        } else {
          pageInsightsError = await getMetaErrorFromResponse(
            pageInsightsResponse,
            `Facebook Page Insights API failed (${pageInsightsResponse.status}).`
          );
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
                  kind: 'organic_post',
                  campaign: fallbackCampaign,
                  impressions: 0,
                  clicks: 0,
                  amountSpent: 0,
                  postEngagement: 0,
                  publishedAt: post?.created_time || '',
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
                    kind: 'organic_post',
                    campaign: fallbackCampaign,
                    impressions: 0,
                    clicks: 0,
                    amountSpent: 0,
                    postEngagement: 0,
                    publishedAt: post?.created_time || '',
                  };
                }
                const postInsightsData = await postInsightsResponse.json();
                return {
                  id: postId,
                  source: 'facebook',
                  kind: 'organic_post',
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
                  publishedAt: post?.created_time || '',
                };
              } catch {
                return {
                  id: postId,
                  source: 'facebook',
                  kind: 'organic_post',
                  campaign: fallbackCampaign,
                  impressions: 0,
                  clicks: 0,
                  amountSpent: 0,
                  postEngagement: 0,
                  publishedAt: post?.created_time || '',
                };
              }
            })
          );

          organicPosts = postInsightRows;
        }
      }

      const campaigns = [...adCampaigns, ...organicPosts];

      const totalPostEngagement = campaigns.reduce(
        (sum, item) => sum + item.postEngagement,
        0
      );

      const payload = {
        dateRange: { since, until },
        campaigns,
        summary: {
          source: 'facebook',
          pageId: facebookPageId || '-',
          impressions: pageImpressions,
          postEngagement: totalPostEngagement,
          pageEngagement: pageEngagement,
          pageLikes,
          reach: pageReach,
          pageInsightsFetched,
          pageInsightsError,
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

  const metaTokenConfig = resolveMetaAccessToken(clientConfig.metaAccessTokenEnv);
  const accessToken = metaTokenConfig.token;
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
        `Set ${clientConfig.metaAccessTokenEnv} (recommended) or INSTAGRAM_ACCESS_TOKEN in .env`,
    });
    return;
  }

  let igUserId = igUserIdFromEnv;
  let resolvedFacebookPageId = facebookPageId;
  let pageData = null;
  let configuredPageError = '';

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

    if (shouldFetchPageData) {
      if (facebookPageId) {
        const pageFields = clientConfig.includeFacebook
          ? 'id,name,fan_count,instagram_business_account{id}'
          : 'id,name,instagram_business_account{id}';
        const pageUrl = buildGraphUrl(
          `${graphVersion}/${facebookPageId}`,
          { fields: pageFields },
          accessToken
        );
        const pageResponse = await fetch(pageUrl);
        if (pageResponse.ok) {
          pageData = await pageResponse.json();
        } else {
          configuredPageError = await getMetaErrorFromResponse(
            pageResponse,
            `Facebook Page API failed (${pageResponse.status}).`
          );
        }
      }

      if (!pageData) {
        const discoveredPage = await discoverManagedPageWithInstagram(
          graphVersion,
          accessToken
        );
        if (discoveredPage) {
          pageData = discoveredPage;
          resolvedFacebookPageId = (discoveredPage.id || '').trim() || resolvedFacebookPageId;
        }
      }

      if (!igUserId && pageData?.instagram_business_account?.id) {
        igUserId = pageData.instagram_business_account.id;
      }
    }

    const result = { dateRange: { since, until }, instagram: null, facebook: null };

    const fetchFacebook = async () => {
      if (!clientConfig.includeFacebook) return null;
      if (!resolvedFacebookPageId || !pageData) return null;
      const fbPostsUrl = buildGraphUrl(
        `${graphVersion}/${resolvedFacebookPageId}/posts`,
        { fields: 'id,message,created_time,full_picture', limit: '20' },
        accessToken
      );
      const fbInsightsUrl = buildGraphUrl(
        `${graphVersion}/${resolvedFacebookPageId}/insights`,
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
            kind: 'organic_post',
            campaign: (row.message || '').slice(0, 70) || 'Facebook post',
            impressions: 0,
            clicks: 0,
            amountSpent: 0,
            postEngagement: 0,
            publishedAt: row.created_time || '',
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
              kind: 'social_post',
              campaign: row.caption?.slice(0, 70) || `${row.media_type || 'MEDIA'} post`,
              impressions: parseNumber(mediaInsight?.impressions),
              clicks: likes,
              amountSpent: 0,
              postEngagement: likes + comments,
              publishedAt: row.timestamp || '',
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
      const withPageError = configuredPageError
        ? `${setupHint}. Also verify page access: ${configuredPageError}`
        : setupHint;
      sendJson(res, 400, {
        error: withPageError,
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

const createServer = () =>
  http.createServer((req, res) => {
    requestHandler(req, res);
  });

module.exports = {
  createServer,
  requestHandler,
};

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Instagram API server listening on http://localhost:${PORT}`);
  });
}
