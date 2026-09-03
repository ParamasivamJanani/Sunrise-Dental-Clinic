import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token from localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 and refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept if the request was for login or refresh itself
      if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/refresh') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Attempt to refresh
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;

          // Save new tokens
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear and logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
