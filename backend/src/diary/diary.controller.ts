import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { QueryDiaryDto } from './dto/query-diary.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

  /**
   * POST /api/diary
   * Yeni günlük oluştur
   */
  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateDiaryDto,
  ) {
    return this.diaryService.create(user.id, dto);
  }

  /**
   * GET /api/diary
   * Tüm günlükleri listele (paginated)
   */
  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query() query: QueryDiaryDto,
  ) {
    return this.diaryService.findAll(user.id, query.page, query.limit);
  }

  /**
   * GET /api/diary/stats
   * Kullanıcı istatistikleri
   * ÖNEMLİ: :date'den ÖNCE olmalı!
   */
  @Get('stats')
  async getStats(@CurrentUser() user: { id: string }) {
    return this.diaryService.getStats(user.id);
  }

  /**
   * GET /api/diary/calendar/:year/:month
   * Aylık takvim verisi
   * ÖNEMLİ: :date'den ÖNCE olmalı!
   */
  @Get('calendar/:year/:month')
  async getCalendar(
    @CurrentUser() user: { id: string },
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.diaryService.getByMonth(
      user.id,
      parseInt(year, 10),
      parseInt(month, 10),
    );
  }

  /**
   * GET /api/diary/:date
   * Belirli tarihteki günlüğü getir (YYYY-MM-DD)
   * ÖNEMLİ: Tüm özel route'lardan SONRA olmalı!
   */
  @Get(':date')
  async findByDate(
    @CurrentUser() user: { id: string },
    @Param('date') dateString: string,
  ) {
    console.log('📅 Finding diary for date:', dateString);
    
    // YYYY-MM-DD formatını doğrula
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      throw new BadRequestException('Geçersiz tarih formatı. YYYY-MM-DD kullanın');
    }
    
    try {
      // YYYY-MM-DD + UTC midnight
      const date = new Date(dateString + 'T00:00:00.000Z');
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      console.log('📅 Parsed date:', date);
      return this.diaryService.findByDate(user.id, date);
    } catch (error) {
      throw new BadRequestException('Geçersiz tarih');
    }
  }

  /**
   * PATCH /api/diary/:id/image
   * Günlüğe resim ekle
   */
  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/diary-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `diary-${uniqueSuffix}${ext}`);
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
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadImage(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenmedi');
    }

    const imageUrl = `/uploads/diary-images/${file.filename}`;
    return this.diaryService.updateImage(user.id, id, imageUrl);
  }

  /**
   * DELETE /api/diary/:id/image
   * Günlükteki resmi sil
   */
  @Delete(':id/image')
  @HttpCode(HttpStatus.OK)
  async removeImage(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.diaryService.removeImage(user.id, id);
  }

  /**
   * DELETE /api/diary/:id
   * Günlük sil
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    await this.diaryService.remove(user.id, id);
  }
}