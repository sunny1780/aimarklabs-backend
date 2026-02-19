const FALLBACK_LOCAL_API = 'http://localhost:5000';

export const getApiBaseUrl = (): string => {
  const configured = (process.env.REACT_APP_API_BASE_URL || '').trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('API base URL missing. Configure REACT_APP_API_BASE_URL in Vercel.');
  }

  return FALLBACK_LOCAL_API;
};

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
