import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

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
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

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
}