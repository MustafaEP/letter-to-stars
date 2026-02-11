import { apiClient } from './axios';
import type { User, UpdateProfileRequest } from '../types/auth.types';

export const usersApi = {
  /**
   * Profil bilgilerini getir
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  /**
   * Profil güncelle (name, bio)
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/users/profile', data);
    return response.data;
  },

  /**
   * Profil resmi yükle
   */
  uploadProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.patch<User>('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Profil resmini sil
   */
  removeProfilePicture: async (): Promise<User> => {
    const response = await apiClient.delete<User>('/users/profile-picture');
    return response.data;
  },
};