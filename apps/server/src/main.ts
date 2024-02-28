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

  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('SERVER_PORT') || 3001);
}
bootstrap();
