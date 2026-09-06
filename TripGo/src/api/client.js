/**
 * API Client — Phase 8
 *
 * Axios instance pre-configured with:
 * - Base URL from environment config
 * - Auth token injection via request interceptor
 * - Global error handling via response interceptor
 * - Request timeout
 *
 * Usage:
 *   import apiClient from '../api/client';
 *   const res = await apiClient.get('/packages');
 */

import { API_BASE_URL, API_TIMEOUT } from '../config/env';

// Lazy import store to avoid circular dependency at module load
let _store = null;
const getStore = () => {
  if (!_store) {
    _store = require('../redux/store').default;
  }
  return _store;
};

// ── Build a minimal fetch-based client since Axios isn't installed ──────────
// When Axios is added (npm install axios) swap this for:
//   import axios from 'axios';
//   const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT });
// For now we provide an axios-compatible interface on top of fetch.

const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const state = getStore().getState();
    const token = state?.auth?.token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // store not ready yet — skip token
  }
  return headers;
};

const timeoutFetch = (url, options, ms = API_TIMEOUT) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
};

const parseResponse = async (res) => {
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const apiClient = {
  get: (path, config = {}) =>
    timeoutFetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { ...buildHeaders(), ...(config.headers || {}) },
    }).then(parseResponse),

  post: (path, body = {}, config = {}) =>
    timeoutFetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { ...buildHeaders(), ...(config.headers || {}) },
      body: JSON.stringify(body),
    }).then(parseResponse),

  put: (path, body = {}, config = {}) =>
    timeoutFetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: { ...buildHeaders(), ...(config.headers || {}) },
      body: JSON.stringify(body),
    }).then(parseResponse),

  patch: (path, body = {}, config = {}) =>
    timeoutFetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { ...buildHeaders(), ...(config.headers || {}) },
      body: JSON.stringify(body),
    }).then(parseResponse),

  delete: (path, config = {}) =>
    timeoutFetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: { ...buildHeaders(), ...(config.headers || {}) },
    }).then(parseResponse),
};

export default apiClient;
