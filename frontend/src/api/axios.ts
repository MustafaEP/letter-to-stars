import axios from 'axios';
import toast from 'react-hot-toast';  // ← Import
import { tokenUtils } from '../utils/token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenUtils.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with Toast
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network Error
    if (!error.response) {
      toast.error('İnternet bağlantınızı kontrol edin', {
        id: 'network-error',
      });
      return Promise.reject(error);
    }

    // 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        tokenUtils.set(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenUtils.remove();

        toast.error('Oturumunuz sonlandı. Lütfen tekrar giriş yapın.', {
          id: 'session-expired',
        });

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('Bu işlem için yetkiniz yok', {
        id: 'forbidden',
      });
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Aradığınız kayıt bulunamadı', {
        id: 'not-found',
      });
    }

    // 409 Conflict
    if (error.response?.status === 409) {
      const message = error.response?.data?.message || 'Bu kayıt zaten mevcut';
      toast.error(message, {
        id: 'conflict',
      });
    }

    // 500 Server Error
    if (error.response?.status >= 500) {
      toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.', {
        id: 'server-error',
      });
    }

    return Promise.reject(error);
  }
);