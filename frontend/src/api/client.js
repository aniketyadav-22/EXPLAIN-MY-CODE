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

// Auto refresh token on 401 errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

  register: (username, password, passwordConfirm, email = '') =>
    client.post('/auth/register/', {
      username,
      password,
      password_confirm: passwordConfirm,
      email,
    }),

  refreshToken: (refreshToken) =>
    client.post('/auth/token/refresh/', { refresh: refreshToken }),
};

export default client;
