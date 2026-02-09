import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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
  
  const port = config.get<number>("PORT") ?? 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
