import axios from 'axios';

const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:3333/api', 
  timeout: 10000 
});

// attacher token JWT si disponible
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
}, err => Promise.reject(err));

api.interceptors.response.use(res => res, err => {
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  }
  return Promise.reject(err);
});

export default api;
