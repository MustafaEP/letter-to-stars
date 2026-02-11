export interface Word {
    english_word: string;
    turkish_meaning: string;
}
  
export interface Diary {
    id: string;
    originalText: string;
    rewrittenText: string;
    ieltsLevel: number;
    newWords: Word[];
    imageUrl: string | null;
    entryDate: string;  // ISO date string
    createdAt: string;
  }
  
export interface CreateDiaryRequest {
    originalText: string;
    ieltsLevel: number;
}
  
export interface DiaryListResponse {
    data: Diary[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
}