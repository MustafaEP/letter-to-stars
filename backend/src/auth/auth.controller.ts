import { Controller, Post, Body, Get, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UnauthorizedException } from '@nestjs/common';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request, // Header'lara, IP'ye, cookie'ye erişmek için
    @Res({ passthrough: true }) response: Response,
  ) {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;

    const result = await this.authService.register(dto, userAgent, ipAddress);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',  // ← Development'ta lax
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',  // ← Tüm path'lerde geçerli
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;

    const result = await this.authService.login(dto, userAgent, ipAddress);

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }
  /**
   * POST /auth/refresh
   * Refresh token ile yeni access token al
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('🍪 All cookies:', request.cookies);
    console.log('🍪 Refresh token:', request.cookies?.refreshToken);
    
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token bulunamadı');
    }

    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;

    const result = await this.authService.refreshTokens(
      refreshToken,
      userAgent,
      ipAddress,
    );

    return { accessToken: result.accessToken };
  }

  /**
   * POST /auth/logout
   * Çıkış yap (mevcut cihaz)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Cookie'yi temizle
    response.clearCookie('refreshToken');

    return { message: 'Başarıyla çıkış yapıldı' };
  }

  /**
   * POST /auth/logout-all
   * Tüm cihazlardan çıkış yap
   */
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logoutAllDevices(user.id);
    response.clearCookie('refreshToken');

    return { message: 'Tüm cihazlardan çıkış yapıldı' };
  }

  /**
   * POST /auth/change-password
   * Şifre değiştir
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, dto.oldPassword, dto.newPassword);
    return { message: 'Şifre başarıyla değiştirildi' };
  }

  /**
   * GET /auth/me
   * Mevcut kullanıcı bilgisi
   */
  @Get('me')
  async getMe(@CurrentUser() user: { id: string }) {
    return this.authService.getUserProfile(user.id);
  }
}