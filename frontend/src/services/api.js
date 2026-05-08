import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
});

export async function shortenUrl({ longUrl, alias, expiresAt, captchaToken }) {
  const headers = {};
  if (captchaToken) headers['CF-Turnstile-Response'] = captchaToken;

  const res = await api.post(
    '/api/shorten',
    { long_url: longUrl, alias: alias || undefined, expires_at: expiresAt || undefined },
    { headers }
  );
  return res.data;
}

export async function fetchAnalytics(code, ownerToken) {
  const res = await api.get(`/api/analytics/${code}`, {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  return res.data;
}

export async function deleteLink(code, ownerToken) {
  const res = await api.delete(`/api/links/${code}`, {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  return res.data;
}

export async function updateLink(code, ownerToken, updates) {
  const res = await api.patch(`/api/links/${code}`, updates, {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  return res.data;
}
