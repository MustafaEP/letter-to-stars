import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // DTO'da olmayan fieldları sil
      forbidNonWhitelisted: false,  // Extra field varsa hata ver
      transform: true,        // Plain object → DTO class'a dönüştür
      disableErrorMessages: process.env.NODE_ENV === 'production',  // Production'da detaylı hata gösterme
    }),
  );

  // Cookie parser
  app.use(cookieParser.default());

  // Static files
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  console.log('📁 Static files serving from:', uploadsPath);
  
  app.enableCors({
    origin: [
      'https://lettertostars.mustafaerhanportakal.com',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`📸 Images available at http://localhost:${port}/uploads/profile-pictures/`);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
