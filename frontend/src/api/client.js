import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const explainApi = {
  explainCode: (code, language, level) =>
    client.post('/explain/', { code, language, level }),
  
  getExplanations: (snippetId) =>
    client.get(`/explanations/${snippetId}/`),
  
  sendFeedback: (explanationId, isHelpful, comment = '') =>
    client.post('/feedback/', {
      explanation_id: explanationId,
      is_helpful: isHelpful,
      comment,
    }),
  
  getHistory: () =>
    client.get('/history/'),
  
  getAnalytics: () =>
    client.get('/analytics/'),
  
  login: (username, password) =>
    client.post('/auth/token/', { username, password }),
  
  refreshToken: (refreshToken) =>
    client.post('/auth/token/refresh/', { refresh: refreshToken }),
};

export default client;
