import axios from 'axios';
import { tokenUtils } from '../utils/token';

// DEĞİŞTİR: VPS IP veya domain
const API_URL = 'https://lettertostars.mustafaerhanportakal.com/api';
// Localhost test için (Android Emulator)
// const API_URL = 'http://10.0.2.2:3000/api';
// iOS Simulator için
// const API_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenUtils.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenUtils.remove();
      // TODO: Navigate to login screen
    }
    return Promise.reject(error);
  }
);