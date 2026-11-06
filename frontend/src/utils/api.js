// Centralized API configuration for AI Career Mentor

// Strip any accidental trailing /api from the base URL to prevent /api/api double-prefix
const rawBase =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:5001';

export const API_BASE_URL = rawBase.replace(/\/api\/?$/, '');

export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  HEALTH: `${API_BASE_URL}/api/health`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
  PREDICTION: `${API_BASE_URL}/api/prediction/predict`,
  APTITUDE: {
    QUESTIONS: `${API_BASE_URL}/api/aptitude/questions`,
    SUBMIT: `${API_BASE_URL}/api/aptitude/submit`,
    STATS: `${API_BASE_URL}/api/aptitude/stats`,
    HISTORY: `${API_BASE_URL}/api/aptitude/history`,
  },
  CODING: {
    PROBLEMS: `${API_BASE_URL}/api/coding/problems`,
    SUBMIT: `${API_BASE_URL}/api/coding/attempt`,
    STATS: `${API_BASE_URL}/api/coding/stats`,
    HISTORY: `${API_BASE_URL}/api/coding/history`,
  },
  PROJECTS: `${API_BASE_URL}/api/projects`,
  CERTIFICATIONS: `${API_BASE_URL}/api/certifications`,
  INTERNSHIPS: `${API_BASE_URL}/api/internships`,
  ACHIEVEMENTS: `${API_BASE_URL}/api/achievements`,
};
