const API_URL = import.meta.env.VITE_API_URL || 'https://dro-nc15.onrender.com';

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  // Build a Headers object safely from options.headers (HeadersInit)
  const headers = new Headers();
  if (options.headers) {
    const existing = new Headers(options.headers as HeadersInit);
    existing.forEach((value, key) => headers.set(key, value));
  }

  // Attach token as Bearer (backend expects 'Bearer <token>')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set content-type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    // Only set if not already provided
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object when possible.
    try {
      (error as any).info = await response.json();
    } catch (e) {
      (error as any).info = null;
    }
    (error as any).status = response.status;
    throw error;
  }

  // Try to parse JSON, fallback to null for empty responses
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};
