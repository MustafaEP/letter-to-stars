import { apiClient } from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

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
     * Çıkış yap
     */
    logout: async (): Promise<void> => {
        // TODO: Backend'e logout endpoint'i eklenince burası güncellenecek
        // await apiClient.post('/auth/logout');
    },
};