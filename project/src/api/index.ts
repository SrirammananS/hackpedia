import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (email: string, password: string) => 
    api.post('/api/auth/register', { email, password }),
  
  logout: () => 
    api.post('/api/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/api/auth/me'),
};

// Vulnerabilities API
export const vulnerabilitiesAPI = {
  getAll: () => 
    api.get('/api/vulnerabilities'),
  
  getById: (id: string) => 
    api.get(`/api/vulnerabilities/${id}`),
  
  create: (data: any) => 
    api.post('/api/vulnerabilities', data),
  
  update: (id: string, data: any) => 
    api.put(`/api/vulnerabilities/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/api/vulnerabilities/${id}`),
};

export default api;