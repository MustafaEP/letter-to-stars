export class WordDto {
  english_word: string;
  turkish_meaning: string;
}

export class GrammarCorrectionDto {
  original: string;
  corrected: string;
  explanation: string;
}

export class DiaryResponseDto {
  id: string;
  originalText: string;
  grammarCorrections?: GrammarCorrectionDto[];
  rewrittenText: string;
  ieltsLevel: number;
  newWords: WordDto[]
  writingTips?: string[];
  strengths?: string[];
  weaknesses?: string[];
  overallFeedback?: string;
  imageUrl: string | null;
  entryDate: Date;
  createdAt: Date;
}