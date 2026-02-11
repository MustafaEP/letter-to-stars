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
    }),
  );

  // Cookie parser
  app.use(cookieParser.default());


  // Static files (uploaded images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      'https://lettertostars.mustafaerhanportakal.com',
      'http://localhost:5173',
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
  console.log('📁 Static files path:', join(__dirname, '..', 'uploads'));
  console.log(`Server is running on port ${port}`);
}
bootstrap();
