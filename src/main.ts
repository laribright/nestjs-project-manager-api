import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('app.port');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
  // setTimeout(() => {
  //   void app.close().catch((error) => {
  //     console.error(error);
  //   });
  // }, 10000);
  await app.listen(port);
  const appName = configService.getOrThrow<string>('app.name');
  console.log(`${appName} is running on: PORT:${port}`);
}
bootstrap();
