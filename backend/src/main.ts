import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // DTO'da olmayan fieldları sil
      forbidNonWhitelisted: true,  // Extra field varsa hata ver
      transform: true,        // Plain object → DTO class'a dönüştür
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'https://lettertostars.mustafaerhanportakal.com',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
