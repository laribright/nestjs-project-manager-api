import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
