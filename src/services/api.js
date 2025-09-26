import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-strategic-save.onrender.com',
 // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again.');
          window.location.href = '/';
          break;
          
        case 403:
          toast.error('Access denied. Insufficient permissions.');
          break;
          
        case 404:
          toast.error('Resource not found.');
          break;
          
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          if (data?.message) {
            toast.error(data.message);
          } else {
            toast.error('An unexpected error occurred.');
          }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: () => api.post('/auth/refresh-token'),
  logout: () => api.post('/auth/logout'),
};

export const vaultAPI = {
  getAll: (params) => api.get('/vaults', { params }),
  getById: (id) => api.get(`/vaults/${id}`),
  create: (data) => api.post('/vaults', data),
  update: (id, data) => api.put(`/vaults/${id}`, data),
  delete: (id) => api.delete(`/vaults/${id}`),
  deposit: (id, data) => api.post(`/vaults/${id}/deposit`, data),
  withdraw: (id, data) => api.post(`/vaults/${id}/withdraw`, data),
  getTransactions: (id, params) => api.get(`/vaults/${id}/transactions`, { params }),
  getStats: (id) => api.get(`/vaults/${id}/stats`),
};

export const userAPI = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getNotifications: (params) => api.get('/notifications', { params }),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const blockchainAPI = {
  getGasPrice: () => api.get('/blockchain/gas-price'),
  estimateGas: (data) => api.post('/blockchain/estimate-gas', data),
  getTransactionStatus: (hash) => api.get(`/blockchain/transaction/${hash}`),
  getBlockNumber: () => api.get('/blockchain/block-number'),
  getNetworkInfo: () => api.get('/blockchain/network-info'),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getInvestmentSummary: () => api.get('/dashboard/investments'),
  getNotifications: () => api.get('/dashboard/notifications'),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getVaultPerformance: (id, period) => api.get(`/analytics/vault/${id}/performance`, { params: { period } }),
  getPortfolioStats: () => api.get('/analytics/portfolio'),
  getMarketData: () => api.get('/analytics/market-data'),
};

// Vault API (additional endpoints for detailed vault operations)
export const vaultDetailsAPI = {
  getById: (vaultId) => api.get(`/vaults/${vaultId}`),
  getUserStats: (userAddress) => api.get(`/vaults/user/${userAddress}/stats`),
  recordDeposit: (vaultId, data) => api.post(`/vaults/${vaultId}/record-deposit`, data),
  recordWithdrawal: (vaultId, data) => api.post(`/vaults/${vaultId}/record-withdrawal`, data),
  syncWithBlockchain: (vaultId) => api.post(`/vaults/${vaultId}/sync`),
};

export default api;