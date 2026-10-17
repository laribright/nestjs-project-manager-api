import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VERSION_NEUTRAL } from '@nestjs/common';

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

  // This is a way of adding a global prefix to all routes
  // app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL, // Keep other existing controllers unversioned
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project Manager API')
    .setDescription('API for the Project Manager application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0');
  const appName = configService.getOrThrow<string>('app.name');
  console.log(`${appName} is running on: PORT:${port}`);
}
bootstrap();
