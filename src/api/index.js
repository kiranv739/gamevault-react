import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const { useAuthStore } = await import('../store/useAuthStore');
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const { useAuthStore } = await import('../store/useAuthStore');
      const { useToastStore } = await import('../store/useToastStore');
      
      const { logout } = useAuthStore.getState();
      logout(); // Silently clear auth state
      
      const { showToast } = useToastStore.getState();
      if (showToast) {
        showToast('Session expired. Please login again.', 'warning');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
