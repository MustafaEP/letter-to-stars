import { apiClient } from './axios';
import { User } from '../types/auth.types';

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.patch<User>('/users/profile', data);
    return response.data;
  },
};
