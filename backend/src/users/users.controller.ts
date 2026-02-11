import { Controller, Get, Patch, Delete, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto';   
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
  
    /**
     * GET /api/users/profile
     * Kendi profil bilgilerini getir
     */
    @Get('profile')
    async getProfile(@CurrentUser() user: { id: string }) {
        const userProfile = await this.usersService.findById(user.id);
        
        if (!userProfile) {
        throw new BadRequestException('Kullanıcı bulunamadı');
        }

        const { passwordHash, ...profile } = userProfile;
        return profile;
    }
  
    /**
     * PATCH /api/users/profile
     * Profil bilgilerini güncelle
     */
    @Patch('profile')
    async updateProfile(
        @CurrentUser() user: { id: string },
        @Body() dto: UpdateProfileDto,  // ← Burada kullan
    ) {
        const updated = await this.usersService.updateProfile(user.id, dto);
        const { passwordHash, ...profile } = updated;
        return profile;
    }
  
    /**
     * POST /api/users/profile-picture
     * Profil resmi yükle
     */
    @Patch('profile-picture')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/profile-pictures',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `profile-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return callback(
              new BadRequestException('Sadece resim dosyaları yüklenebilir'),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
    )
    async uploadProfilePicture(
      @CurrentUser() user: { id: string },
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('Dosya yüklenmedi');
      }
  
      // URL oluştur (public erişim için)
      const fileUrl = `/uploads/profile-pictures/${file.filename}`;
  
      const updated = await this.usersService.updateProfilePicture(user.id, fileUrl);
      const { passwordHash, ...profile } = updated;
  
      return profile;
    }
  
    /**
     * DELETE /api/users/profile-picture
     * Profil resmini sil
     */
    @Delete('profile-picture')
    async removeProfilePicture(@CurrentUser() user: { id: string }) {
      const updated = await this.usersService.removeProfilePicture(user.id);
      const { passwordHash, ...profile } = updated;
      return profile;
    }
}