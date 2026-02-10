import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Service içinde kullanmak için internal type
interface AuthServiceResponse {
  accessToken: string;
  refreshToken: string;  
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  
  /**
   * Kullanıcı kaydı
   */
  async register(dto: RegisterDto): Promise<AuthServiceResponse> {
    // 1. Email zaten var mı kontrol et
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanılıyor');
    }

    // 2. Şifreyi hash'le (bcrypt)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // 3. Kullanıcıyı oluştur
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      provider: 'LOCAL',
    });

    // 4. Token'ları oluştur
    const tokens = await this.generateTokens(user.id);

    // 5. Refresh token'ı database'e kaydet
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Kullanıcı girişi
   */
  async login(dto: LoginDto): Promise<AuthServiceResponse> {
    // 1. Kullanıcıyı bul
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // 2. Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // 3. Token'ları oluştur
    const tokens = await this.generateTokens(user.id);

    // 4. Refresh token'ı database'e kaydet
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Access + Refresh token üretir
   */
  private async generateTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Access Token
    const accessPayload = { sub: userId };  // 'sub' = subject (JWT standardı)
    const accessToken = this.jwtService.sign(accessPayload);

    // Refresh Token (farklı secret ve süre)
    const refreshPayload = { sub: userId };
    const refreshToken = this.jwtService.sign(refreshPayload, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
    });

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh token'ı database'e kaydet
   */
  private async saveRefreshToken(userId: string, token: string): Promise<void> {

    // 7 gün sonraki tarih
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Database'e kaydet
    await this.prisma.refreshToken.create({
        data: {
            token: token,
            userId: userId,
            expiresAt: expiresAt,
        },
    });
  }

  /**
   * Refresh token ile yeni access token al
   */
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    // TODO: Sonraki adımda yapacağız
    throw new Error('Not implemented');
  }

  /**
   * Çıkış yap (refresh token'ı iptal et)
   */
  async logout(refreshToken: string): Promise<void> {
    // TODO: Sonraki adımda yapacağız
  }
}