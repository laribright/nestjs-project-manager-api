import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {
  TASKS_OPTIONS,
  TasksOptions,
  TASKS_LABEL,
  TASKS_SERVICE_ALIAS,
} from './tasks.constants';
import { RequestLoggerMiddlware } from '../common/middleware/request-logger.middleware';
import { DemoAuthGuard } from '../common/guards/demo-auth-guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DatabaseModule } from '../database/database.module';
import { TasksRepository } from './tasks.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [
    DemoAuthGuard,
    TasksRepository,
    RolesGuard,
    { provide: TasksService, useClass: TasksService },
    {
      provide: TASKS_OPTIONS,
      useFactory: (config: ConfigService): TasksOptions => ({
        defaultStatus: config.getOrThrow('TASK_DEFAULT_STATUS'),
      }),
      // useValue: { defaultStatus: 'todo' } as TasksOptions,
      inject: [ConfigService],
    },
    {
      provide: TASKS_LABEL,
      useFactory: (options: TasksOptions) =>
        `New tasks start as ${options.defaultStatus}`,
      inject: [TASKS_OPTIONS],
    },
    {
      provide: TASKS_SERVICE_ALIAS,
      useExisting: TasksService,
    },
  ],
  exports: [TasksService],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddlware).forRoutes(TasksController);
  }
}
