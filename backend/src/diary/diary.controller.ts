import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DiaryService }   from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { QueryDiaryDto }  from './dto/query-diary.dto';
import { CurrentUser }    from '../auth/decorators/current-user.decorator';

@Controller('diary')
export class DiaryController {
  constructor(private diaryService: DiaryService) {}

    /**
     * POST /api/diary
     * Yeni günlük oluştur + AI dönüşümü
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
     * Kullanıcının tüm günlüklerini listele (paginated)
     */
    @Get()
    async findAll(
        @CurrentUser() user: { id: string },
        @Query() query: QueryDiaryDto,
    ) {
        return this.diaryService.findAll(user.id, query.page, query.limit);
    }

    /**
     * GET /api/diary/:date
     * Belirli tarihteki günlüğü getir (YYYY-MM-DD)
     */
    @Get(':date')
    async findByDate(
        @CurrentUser() user: { id: string },
        @Param('date') dateString: string,
    ) {
        // YYYY-MM-DD string'ini Date'e çevir
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        
        return this.diaryService.findByDate(user.id, date);
    }

    /**
     * DELETE /api/diary/:id
     * Günlüğü sil
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