import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
  app.useStaticAssets(join(__dirname, '..', 'files'), {
    index: false,
    prefix: '/public',
  });
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
