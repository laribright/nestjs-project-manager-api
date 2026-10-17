import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { ClockModule } from './common/clock.module';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { validateEnv } from './config/validate-env';
import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspaces/workspace.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('UPSTASH_REDIS_HOST'),
          port: configService.get('UPSTASH_REDIS_PORT'),
          password: configService.get('UPSTASH_REDIS_PASSWORD'),
          tls: {},
        },
      }),
    }),
    TasksModule,
    WorkspaceModule,
    AuthModule,
    ReportsModule,
    ClockModule,
    LifecycleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
