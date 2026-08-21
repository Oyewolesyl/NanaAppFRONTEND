/*
  handover: frontend backend client
  - this is the thin fetch layer used by the app after login/signup.
  - the frontend sends the user's bearer token only; it never contains the Supabase service-role key or the private manager token.
  - keep these helpers small and predictable: build the URL, attach auth headers, parse JSON, and let calling screens decide how to recover.
*/
const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://nanaappbackend.onrender.com'
).replace(/\/+$/, '');

export function getStoredAccessToken() {
  return localStorage.getItem('nana_access_token') || '';
}

async function apiRequest(path, { method = 'GET', body, token = getStoredAccessToken() } = {}) {
  if (!token) {
    throw new Error('No signed-in user token available.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Backend request failed with ${response.status}`);
  }

  return data;
}

export function createBackendChild(child) {
  return apiRequest('/api/children', {
    method: 'POST',
    body: {
      name: child.name,
      age: Number(child.age),
      photo_url: child.photo_url || null,
    },
  });
}

export function createBackendPainLog(payload) {
  return apiRequest('/api/pain-logs', {
    method: 'POST',
    body: payload,
  });
}
