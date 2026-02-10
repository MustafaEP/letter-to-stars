import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { AiClientService } from './ai-client.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryController],
  providers: [DiaryService, AiClientService],
})
export class DiaryModule {}