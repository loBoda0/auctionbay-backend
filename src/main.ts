import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import Logging from './library/Logging';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [process.env.FRONTEND, 'http://localhost:5173'],
    credentials: true,
  })
  app.useStaticAssets(join(__dirname, '..', 'files'), {
    index: false,
    prefix: '/public',
  })

  const config = new DocumentBuilder()
  .setTitle('AuctionBay API')
  .setDescription('This is an API for backend of AuctionBay application')
  .setVersion('1.0.0')
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api', app, document)

  app.use(cookieParser())
  await app.listen(3000);

  Logging.info(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
