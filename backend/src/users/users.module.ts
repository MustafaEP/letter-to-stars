import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],  // Prisma bağımlılığı
  providers: [UsersService],
  exports: [UsersService],  // Auth module'ün kullanması için
})
export class UsersModule {}