import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, AuthProvider } from '@prisma/client';

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
}