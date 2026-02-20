import { apiClient } from './axios';
import type {
  CreateDiaryRequest,
  Diary,
  DiaryListResponse,
  DiaryStats,
  CalendarEntry,
  VocabularyResponse,
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


  /**
   * İstatistikleri getir
   */
  getStats: async (): Promise<DiaryStats> => {
    const response = await apiClient.get<DiaryStats>('/diary/stats');
    return response.data;
  },

  /**
   * Aylık takvim verisi
   */
  getCalendar: async (year: number, month: number): Promise<CalendarEntry[]> => {
    const response = await apiClient.get<CalendarEntry[]>(
      `/diary/calendar/${year}/${month}`
    );
    return response.data;
  },


  /**
   * Günlüğe resim yükle
   */
  uploadImage: async (diaryId: string, file: File): Promise<Diary> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.patch<Diary>(
      `/diary/${diaryId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Günlükteki resmi sil
   */
  removeImage: async (diaryId: string): Promise<Diary> => {
    const response = await apiClient.delete<Diary>(`/diary/${diaryId}/image`);
    return response.data;
  },

  /**
   * Kelime listesi
   */
  getVocabulary: async (): Promise<VocabularyResponse> => {
    const response = await apiClient.get<VocabularyResponse>('/diary/vocabulary');
    return response.data;
  },
};