// frontend/src/api/axios.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ajouter token JWT d'autorisation à chaque requête
// sauf pour login/register qui n'en ont pas besoin
api.interceptors.request.use(cfg => {
  // Les endpoints qui NE doivent PAS avoir le token
  const noAuthEndpoints = ['/auth/login', '/auth/register', '/auth/register-reader', '/readers/lookup'];
  const shouldSkipToken = noAuthEndpoints.some(endpoint => cfg.url && cfg.url.includes(endpoint));
  
  if (!shouldSkipToken) {
    const token = localStorage.getItem('token');
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  }
  return cfg;
}, err => Promise.reject(err));

// response interceptor to handle authentication errors
api.interceptors.response.use(res => res, err => {
  if (err.response && err.response.status === 401) {
    // token expired or missing, clear storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  }
  return Promise.reject(err);
});

export default api;
