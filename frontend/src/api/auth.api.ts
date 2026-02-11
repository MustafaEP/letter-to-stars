import { apiClient } from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest } from '../types/auth.types';

export const authApi = {
    /**
     * Kullanıcı girişi
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Kullanıcı kaydı
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Access token yenileme
     */
    refresh: async (): Promise<{ accessToken: string }> => {
        const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
        return response.data;
    },

    /**
     * Çıkış yap
     */
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    /**
     * Tüm cihazlardan çıkış yap
     */
    logoutAll: async (): Promise<void> => {
        await apiClient.post('/auth/logout-all');
    },

    /**
     * Şifre değiştirme
     */
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await apiClient.post('/auth/change-password', data);
    },

    /**
     * Kullanıcı bilgilerini getir
     */
    getMe: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
};