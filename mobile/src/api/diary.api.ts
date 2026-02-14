import { apiClient } from './axios';
import {
  CreateDiaryRequest,
  Diary,
  DiaryListResponse,
  DiaryStats,
} from '../types/diary.types';

export const diaryApi = {
  create: async (data: CreateDiaryRequest): Promise<Diary> => {
    const response = await apiClient.post<Diary>('/diary', data);
    return response.data;
  },

  getAll: async (page: number = 1, limit: number = 10): Promise<DiaryListResponse> => {
    const response = await apiClient.get<DiaryListResponse>('/diary', {
      params: { page, limit },
    });
    return response.data;
  },

  getByDate: async (date: string): Promise<Diary> => {
    const response = await apiClient.get<Diary>(`/diary/${date}`);
    return response.data;
  },

  getStats: async (): Promise<DiaryStats> => {
    const response = await apiClient.get<DiaryStats>('/diary/stats');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/diary/${id}`);
  },
};