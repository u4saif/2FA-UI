import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3500';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  setupTOTP: () => api.post('/auth/totp/setup'),

  verifyTOTPSetup: (token: string) =>
    api.post('/auth/totp/verify-setup', { token }),

  verifyTOTPLogin: (email: string, token: string) =>
    api.post('/auth/totp/verify-login', { email, token }),

  getTOTPStatus: () => api.get('/auth/totp/status'),

  disableTOTP: () => api.post('/auth/totp/disable'),

  validateToken: (token: string) =>
    api.post('/auth/validatetoken', { token }),
};

export default api;
