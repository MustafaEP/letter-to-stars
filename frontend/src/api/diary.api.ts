import { apiClient } from './axios';
import type {
  CreateDiaryRequest,
  Diary,
  DiaryListResponse,
} from '../types/diary.types';

export const diaryApi = {
  /**
   * Yeni günlük oluştur
   */
  create: async (data: CreateDiaryRequest): Promise<Diary> => {
    const response = await apiClient.post<Diary>('/diary', data);
    return response.data;
  },

  /**
   * Tüm günlükleri listele
   */
  getAll: async (page: number = 1, limit: number = 10): Promise<DiaryListResponse> => {
    const response = await apiClient.get<DiaryListResponse>('/diary', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Tarihe göre günlük getir
   */
  getByDate: async (date: string): Promise<Diary> => {
    const response = await apiClient.get<Diary>(`/diary/${date}`);
    return response.data;
  },

  /**
   * Günlük sil
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/diary/${id}`);
  },
};