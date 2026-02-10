import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')  // @Public() YOK - korumalı
  getProtected(@CurrentUser() user: any) {
    return { message: 'Bu korumalı bir endpoint', user };
  }

  @Get('me')  // @Public() YOK - Korumalı endpoint
  getMe(@CurrentUser() user: any) {
    return {
      message: 'Kimlik doğrulandı!',
      user,
    };
  }
}
