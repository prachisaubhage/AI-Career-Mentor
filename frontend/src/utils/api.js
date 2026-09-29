// Centralized API configuration for AI Career Mentor

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:5001';

export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  HEALTH: `${API_BASE_URL}/api/health`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
};
