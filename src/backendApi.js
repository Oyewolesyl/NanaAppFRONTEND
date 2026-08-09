const API_URL = import.meta.env.VITE_API_URL || 'https://nanaappbackend.onrender.com';

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
