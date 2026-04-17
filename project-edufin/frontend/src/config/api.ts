// src/config/api.ts
// Konfigurasi base URL API — auto-detect environment

const isProd = window.location.hostname === "lk21film.online";

// Saat di production (lk21film.online), pakai backend yang sudah di-deploy
// Saat development (localhost), pakai Laravel lokal
export const API_BASE = isProd
  ? "https://lk21film.online/api"  // ← backend Laravel di domain ini
  : "http://127.0.0.1:8000/api";

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = "217573473398-qr9hej4e7d7jnc53t02861qghbnrj00j.apps.googleusercontent.com";

// Helper fetch dengan token otomatis
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('edufin_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
}

// Shortcut methods
export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: 'GET' }),

  post: (endpoint: string, body: object) =>
    apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
