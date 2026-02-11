import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get('JWT_EXPIRES_IN') || '15m';  // ← <string> kaldır
        
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        
        return {
          secret,
          signOptions: { expiresIn },  // ← Type assertion kaldır
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

/*
* Provider: Nest'in DI sistemine bu sınıfı/servisi ben sağlıyacağım
* diye tanıttığımız şeydir. AuthService burada bir provider'dır.
* 
* Instance: DI sistemi tarafından oluşturulan gerçek nesnedir. 
* AuthService sınıfından oluşturulan gerçek nesne instance'dır.
*/