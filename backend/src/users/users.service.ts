import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    // Email ile kullanıcı bul
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // ID ile kullanıcı bul
    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    // Yeni kullanıcı oluştur
    // async create(data: Prisma.UserCreateInput): Promise<User> {
    //     return this.prisma.user.create({
    //         data,
    //     });
    // }

    // Profil güncelle
    async updateProfile(
        userId: string,
        data: { name?: string; bio?: string; profilePicture?: string },
    ): Promise<User> {
        return this.prisma.user.update({
        where: { id: userId },
        data,
        });
    }

    // Profil resmini güncelle
    async updateProfilePicture(userId: string, pictureUrl: string): Promise<User> {
        return this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture: pictureUrl },
        });
    }

    // Profil resmini sil 
    async removeProfilePicture(userId: string): Promise<User> {
        return this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture: null },
        });
    }

    /**
     * Provider ID ile kullanıcı bul (Google ID)
     */
    async findByProviderId(providerId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
        where: { providerId },
        });
    }
    
    /**
     * Google OAuth için kullanıcı oluştur
     */
    async create(data: {
        email: string;
        name?: string;
        provider?: AuthProvider;
        providerId?: string;
        profilePicture?: string;
        emailVerified?: boolean;
        passwordHash?: string;
    }): Promise<User> {
        return this.prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            provider: data.provider || AuthProvider.LOCAL,
            providerId: data.providerId,
            profilePicture: data.profilePicture,
            emailVerified: data.emailVerified || false,
            passwordHash: data.passwordHash,
        },
        });
    }


  /**
   * Kullanıcı istatistiklerini getir
   */
  async getUserStats(userId: string) {
    const diaries = await this.prisma.diary.findMany({
      where: { userId },
      orderBy: { entryDate: 'desc' },
      select: {
        entryDate: true,
        newWords: true,
        ieltsLevel: true,
      },
    });

    // Toplam günlük
    const totalEntries = diaries.length;

    // Toplam kelime
    const totalWords = diaries.reduce((sum, diary) => {
      const words = diary.newWords as any[];
      return sum + (Array.isArray(words) ? words.length : 0);
    }, 0);

    // IELTS dağılımı
    const ieltsDistribution = diaries.reduce((acc, diary) => {
      acc[diary.ieltsLevel] = (acc[diary.ieltsLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const favoriteLevel = Object.entries(ieltsDistribution).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0];

    // Streak hesaplama
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = diaries
      .map((d) => new Date(d.entryDate))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length > 0) {
      const lastEntry = sortedDates[0];
      const diffDays = Math.floor(
        (today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Son günlük bugün veya dün ise streak devam ediyor
      if (diffDays <= 1) {
        currentStreak = 1;
        tempStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
          const diff = Math.floor(
            (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) /
              (1000 * 60 * 60 * 24),
          );

          if (diff === 1) {
            currentStreak++;
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
      totalEntries,
      totalWords,
      currentStreak,
      longestStreak,
      favoriteLevel: favoriteLevel ? parseInt(favoriteLevel) : null,
      ieltsDistribution,
    };
  }

  /**
   * Hesabı kalıcı olarak sil
   */
  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Cascade delete (Prisma schema'da onDelete: Cascade var)
    // Diary ve RefreshToken otomatik silinecek
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }
}