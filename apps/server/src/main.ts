import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('apishka');
  const configService = app.get(ConfigService);

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: configService.getOrThrow('CLIENT_ORIGIN'),
    credentials: true,
  });

  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  console.log(' !!!!  Hello from server/main.ts !!!!');

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('SERVER_PORT') || 4001);
}
bootstrap();
