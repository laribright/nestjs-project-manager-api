import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {
  TASKS_OPTIONS,
  TasksOptions,
  TASKS_LABEL,
  TASKS_SERVICE_ALIAS,
} from './tasks.constants';

@Module({
  controllers: [TasksController],
  providers: [
    { provide: TasksService, useClass: TasksService },
    {
      provide: TASKS_OPTIONS,
      useValue: { defaultStatus: 'todo' } as TasksOptions,
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
  // providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
