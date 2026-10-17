import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';

import { TaskCreatedEvent } from './task-created.event';

@Injectable()
export class TasksEventsListener {
  constructor(
    @InjectQueue('task-notification')
    private readonly queue: Queue,
  ) {}

  @OnEvent('task.created')
  async handleCreated(event: TaskCreatedEvent) {
    await this.queue.add(
      'task-created-preview',
      {
        taskId: event.taskId,
        ownerId: event.ownerId,
      },
      {
        attempts: 3, // = 2 attemps. First attempt when registered.
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
  }
}
