import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiClientService } from './ai-client.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { DiaryResponseDto } from './dto/diary-response.dto';

@Injectable()
export class DiaryService {
  constructor(
    private prisma: PrismaService,
    private aiClient: AiClientService,
  ) {}

  /**
   * Yeni günlük oluştur + AI dönüşümü
   */
  async create(userId: string, dto: CreateDiaryDto): Promise<DiaryResponseDto> {
    // 1. Bugün zaten entry var mı kontrol et
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntry = await this.prisma.diary.findUnique({
      where: {
        userId_entryDate: {
          userId,
          entryDate: today,
        },
      },
    });

    if (existingEntry) {
      throw new ConflictException('Bugün için zaten bir günlük girdiniz');
    }

    // 2. AI servisine gönder
    const aiResponse = await this.aiClient.rewriteText(
      dto.originalText,
      dto.ieltsLevel,
    );

    // 3. Database'e kaydet
    const diary = await this.prisma.diary.create({
      data: {
        userId,
        originalText: dto.originalText,
        rewrittenText: aiResponse.rewritten_text,
        ieltsLevel: dto.ieltsLevel,
        newWords: aiResponse.new_words,
        entryDate: today,
      },
    });

    // 4. Response DTO'ya dönüştür
    return {
      id: diary.id,
      originalText: diary.originalText,
      rewrittenText: diary.rewrittenText,
      ieltsLevel: diary.ieltsLevel,
      newWords: diary.newWords as any,  // Prisma Json type
      imageUrl: diary.imageUrl,
      entryDate: diary.entryDate,
      createdAt: diary.createdAt,
    };
  }

  /**
   * Kullanıcının tüm günlüklerini getir
   */
  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [diaries, total] = await Promise.all([
      this.prisma.diary.findMany({
        where: { userId },
        orderBy: { entryDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.diary.count({ where: { userId } }),
    ]);

    return {
      data: diaries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  /**
   * Kelime listesi
   */
  async getVocabulary(userId: string) {
    const diaries = await this.prisma.diary.findMany({
      where: { userId },
      select: {
        id: true,
        entryDate: true,
        ieltsLevel: true,
        newWords: true,
      },
      orderBy: { entryDate: 'desc' },
    });
  
    // Tüm kelimeleri topla
    const allWords: {
      word: string;
      meaning: string;
      date: Date;
      diaryId: string;
      ieltsLevel: number;
    }[] = [];
  
    for (const diary of diaries) {
      const words = diary.newWords as Array<{
        english_word: string;
        turkish_meaning: string;
      }>;
  
      if (Array.isArray(words)) {
        words.forEach((w) => {
          allWords.push({
            word: w.english_word,
            meaning: w.turkish_meaning,
            date: diary.entryDate,
            diaryId: diary.id,
            ieltsLevel: diary.ieltsLevel,
          });
        });
      }
    }
  
    // Alfabetik sırala
    allWords.sort((a, b) => a.word.localeCompare(b.word));
  
    return {
      total: allWords.length,
      words: allWords,
    };
  }

  /**
   * Belirli tarihteki günlüğü getir
   */
  async findByDate(userId: string, date: Date): Promise<DiaryResponseDto> {
    const diary = await this.prisma.diary.findUnique({
      where: {
        userId_entryDate: {
          userId,
          entryDate: date,
        },
      },
    });

    if (!diary) {
      throw new NotFoundException('Bu tarihte günlük bulunamadı');
    }

    return {
      id: diary.id,
      originalText: diary.originalText,
      rewrittenText: diary.rewrittenText,
      ieltsLevel: diary.ieltsLevel,
      newWords: diary.newWords as any,
      imageUrl: diary.imageUrl,
      entryDate: diary.entryDate,
      createdAt: diary.createdAt,
    };
  }

  /**
   * Günlüğü sil
   */
  async remove(userId: string, id: string): Promise<void> {
    const diary = await this.prisma.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException('Günlük bulunamadı');
    }

    if (diary.userId !== userId) {
      throw new NotFoundException('Bu günlüğü silme yetkiniz yok');
    }

    await this.prisma.diary.delete({
      where: { id },
    });
  }

  /**
   * Kullanıcının günlük istatistiklerini getir
   */
  async getStats(userId: string) {
    // Toplam günlük sayısı
    const total = await this.prisma.diary.count({
      where: { userId },
    });

    // Bu ayki günlük sayısı
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const thisMonth = await this.prisma.diary.count({
      where: {
        userId,
        entryDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Streak hesapla (ardışık günler)
    const allDiaries = await this.prisma.diary.findMany({
      where: { userId },
      select: { entryDate: true },
      orderBy: { entryDate: 'desc' },
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let previousDate: Date | null = null;

    for (const diary of allDiaries) {
      const entryDate = new Date(diary.entryDate);

      if (!previousDate) {
        // İlk gün
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (previousDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Ardışık gün
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else {
          // Kesinti
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          currentStreak = 0;
        }
      }

      previousDate = entryDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      total,
      thisMonth,
      currentStreak,
      longestStreak,
    };
  }

  /**
   * Belirli bir aydaki tüm günlükleri getir (takvim için)
   */
  async getByMonth(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const diaries = await this.prisma.diary.findMany({
      where: {
        userId,
        entryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        entryDate: true,
        ieltsLevel: true,
      },
      orderBy: {
        entryDate: 'asc',
      },
    });

    return diaries;
  }

  /**
   * Günlüğe resim ekle
   */
  async updateImage(userId: string, diaryId: string, imageUrl: string) {
    // Günlük bu kullanıcıya ait mi kontrol et
    const diary = await this.prisma.diary.findUnique({
      where: { id: diaryId },
    });

    if (!diary) {
      throw new NotFoundException('Günlük bulunamadı');
    }

    if (diary.userId !== userId) {
      throw new ForbiddenException('Bu günlük size ait değil');
    }

    // Resmi güncelle
    const updated = await this.prisma.diary.update({
      where: { id: diaryId },
      data: { imageUrl },
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Günlükteki resmi sil
   */
  async removeImage(userId: string, diaryId: string) {
    const diary = await this.prisma.diary.findUnique({
      where: { id: diaryId },
    });

    if (!diary) {
      throw new NotFoundException('Günlük bulunamadı');
    }

    if (diary.userId !== userId) {
      throw new ForbiddenException('Bu günlük size ait değil');
    }

    const updated = await this.prisma.diary.update({
      where: { id: diaryId },
      data: { imageUrl: null },
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Diary entity'sini response DTO'ya çevir
   */
  private mapToResponseDto(diary: any): DiaryResponseDto {
    return {
      id: diary.id,
      originalText: diary.originalText,
      rewrittenText: diary.rewrittenText,
      ieltsLevel: diary.ieltsLevel,
      newWords: Array.isArray(diary.newWords) 
        ? diary.newWords 
        : JSON.parse(JSON.stringify(diary.newWords)),
      imageUrl: diary.imageUrl,
      entryDate: diary.entryDate,
      createdAt: diary.createdAt,
    };
  }
}