import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Internal Type: Uygulama içinde kullanmak için oluşturulan typedır.
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

/*
* Dependency Injection (DI): bir sınıfın ihtiyacı olan bağımlılıkları
* kendisi oluşturması yerine, dışarıdan hazı verilmesi yaklaşımıdır.
*/

@Injectable() // Bu sınıfın DI sistemi tarafından yönetileceğini belirtir.
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
  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string): Promise<AuthServiceResponse> {
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
    const tokens = await this.generateTokens({ sub: user.id });

    // 5. Refresh token'ı database'e kaydet
    await this.saveRefreshToken(user.id, tokens.refreshToken, userAgent, ipAddress);

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
  async login(dto: LoginDto, userAgent?: string, ipAddress?: string): Promise<AuthServiceResponse> {
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
    const tokens = await this.generateTokens({ sub: user.id });

    // 4. Last login güncelle
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 5. Refresh token'ı database'e kaydet
    await this.saveRefreshToken(user.id, tokens.refreshToken, userAgent, ipAddress);

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
   * Access ve Refresh token oluştur
   */
  private generateTokens(payload: { sub: string }): {
    accessToken: string;
    refreshToken: string;
  } {
    // Access token
    const accessToken = this.jwtService.sign(payload);

    // Refresh token 
    const refreshToken = this.jwtService.sign(
      payload,  
      {
        secret: this.configService.get<string>('REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN') as any,   
      } as any, 
    );

    return { accessToken, refreshToken };
  }

  /**
   * Refresh token ile yeni access token al
   */
  async refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string }> {
    try {
      // 1. Refresh token'ı verify et
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_SECRET'),
      });

      // 2. Database'de var mı kontrol et
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new UnauthorizedException('Geçersiz refresh token');
      }

      // 3. Expire olmuş mu kontrol et
      if (new Date() > tokenRecord.expiresAt) {
        // Expire olmuş token'ı sil
        await this.prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });
        throw new UnauthorizedException('Refresh token süresi dolmuş');
      }

      // 4. User ID eşleşiyor mu
      if (tokenRecord.userId !== payload.sub) {
        throw new UnauthorizedException('Token kullanıcı eşleşmiyor');
      }

      // 5. Yeni access token üret
      const accessPayload = { sub: tokenRecord.userId };
      const accessToken = this.jwtService.sign(accessPayload);

      // 6. Last login güncelle
      await this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { lastLoginAt: new Date() },
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Refresh token doğrulanamadı');
    }
  }

  /**
   * Çıkış yap - Refresh token'ı iptal et
   */
  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * Kullanıcının tüm refresh token'larını iptal et (all devices logout)
   */
  async logoutAllDevices(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Refresh token'ı database'e kaydet
   */
  private async saveRefreshToken(
    userId: string,
    token: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });
  }

  /**
   * Şifre değiştir
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    // 1. Kullanıcıyı bul
    const user = await this.usersService.findById(userId);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // 2. Eski şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Eski şifre hatalı');
    }

    // 3. Yeni şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 4. Güncelle
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // 5. Tüm cihazlardan çıkış yap (güvenlik)
    await this.logoutAllDevices(userId);
  }

  /**
 * Kullanıcı profil bilgilerini getir
 */
  async getUserProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // Hassas bilgileri çıkar
    const { passwordHash, ...userProfile } = user;

    return {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role,
      provider: userProfile.provider,
      profilePicture: userProfile.profilePicture,
      bio: userProfile.bio,
      emailVerified: userProfile.emailVerified,
      lastLoginAt: userProfile.lastLoginAt,
      createdAt: userProfile.createdAt,
    };
  }

  
  /**
   * Google OAuth ile giriş/kayıt
   */
  async googleLogin(
    googleUser: {
      providerId: string;
      email: string;
      name: string;
      profilePicture?: string;
      provider: string;
    },
    userAgent?: string,
    ipAddress?: string,
  ) {
    // 1. Google ID ile kullanıcı var mı?
    let user = await this.usersService.findByProviderId(googleUser.providerId);

    // 2. Email ile kullanıcı var mı?
    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);

      // Email var ama local provider → Link accounts
      if (user && user.provider === AuthProvider.LOCAL) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            providerId: googleUser.providerId,
            provider: AuthProvider.GOOGLE,
            profilePicture: googleUser.profilePicture || user.profilePicture,
            emailVerified: true,
          },
        });
      }
    }

    // 3. Hiç kullanıcı yok → Yeni kayıt
    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        provider: AuthProvider.GOOGLE,
        providerId: googleUser.providerId,
        profilePicture: googleUser.profilePicture,
        emailVerified: true,
      });
    }

    // 4. Token'ları oluştur
    const tokens = await this.generateTokens({ sub: user.id });  

    // 5. Refresh token'ı kaydet
    await this.saveRefreshToken(user.id, tokens.refreshToken, userAgent, ipAddress);

    // 6. Last login güncelle
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    };
  }

  
}