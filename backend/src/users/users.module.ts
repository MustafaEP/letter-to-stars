import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
@Module({
  imports: [PrismaModule],  // Prisma bağımlılığı
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],  // Auth module'ün kullanması için
})
export class UsersModule {}