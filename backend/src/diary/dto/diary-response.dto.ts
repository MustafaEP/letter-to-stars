export class WordDto {
    english_word: string;
    turkish_meaning: string;
  }
  
  export class DiaryResponseDto {
    id: string;
    originalText: string;
    rewrittenText: string;
    ieltsLevel: number;
    newWords: WordDto[];
    imageUrl: string | null;
    entryDate: Date;
    createdAt: Date;
  }