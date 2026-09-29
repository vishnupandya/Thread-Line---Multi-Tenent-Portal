import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {
      success: false,
      message: error.message || 'Network error occurred. Please check your connection.',
      code: 'NETWORK_ERROR',
    };

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.dispatchEvent(new CustomEvent('threadline:unauthorized'));
      }
    }

    return Promise.reject(errorData);
  }
);

export default api;
