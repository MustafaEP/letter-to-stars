import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { AiClientService } from './diary/ai-client.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private aiClient: AiClientService) {}

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


  @Public()
  @Get('test-ai')
  async testAI(
    @Query('text') text: string = 'Today I went to the park.',
    @Query('level') level: string = '7',
  ) {
    const result = await this.aiClient.rewriteText(text, parseInt(level));
    return result;
  }

  // POST version (body)
  @Public()
  @Post('test-ai')
  async testAIPost(
    @Body() body: { text: string; level: string },
  ) {
    const result = await this.aiClient.rewriteText(
      body.text,
      parseInt(body.level),
    );
    return result;
  }
}
