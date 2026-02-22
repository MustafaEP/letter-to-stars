export interface Word {
    english_word: string;
    turkish_meaning: string;
}
  
export interface GrammarCorrection {
    original: string;
    corrected: string;
    explanation: string;
}

export interface Diary {
    id: string;
    originalText: string;
    rewrittenText: string;
    ieltsLevel: number;
    newWords: Word[];
    grammarCorrections?: GrammarCorrection[];
    writingTips?: string[];
    strengths?: string[];
    weaknesses?: string[];
    overallFeedback?: string;
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

export interface DiaryStats {
  total: number;
  thisMonth: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CalendarEntry {
  id: string;
  entryDate: string;
  ieltsLevel: number;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  date: string;
  diaryId: string;
  ieltsLevel: number;
}

export interface VocabularyResponse {
  total: number;
  words: VocabularyWord[];
}