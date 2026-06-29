const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const buildApiUrl = (path: string) => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE_URL) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const originalFetch = globalThis.fetch?.bind(globalThis);

if (typeof window !== 'undefined' && originalFetch) {
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

    if (typeof url === 'string' && (url.startsWith('/api') || url.startsWith('api/'))) {
      return originalFetch(buildApiUrl(url), init);
    }

    return originalFetch(input, init);
  }) as typeof fetch;
}

export const apiFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url;

  if (typeof url === 'string' && (url.startsWith('/api') || url.startsWith('api/'))) {
    return fetch(buildApiUrl(url), init);
  }

  return fetch(input, init);
};
