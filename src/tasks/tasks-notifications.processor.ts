import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

type TaskNotifcationData = {
  taskId: number;
  ownerId: number;
};

@Processor('task-notification')
export class TasksNotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksNotificationsProcessor.name);

  async process(job: Job<TaskNotifcationData>): Promise<void> {
    if (job.name !== 'task-created-preview') {
      throw new Error('Unsupported job name');
    }

    if (job.attemptsMade === 0) {
      this.logger.warn('THIs is the first attempt to process the job');
    }

    this.logger.log(
      `Processing task ${job.data.taskId} for owner ${job.data.ownerId}`,
    );

    // TODO: Implement the logic to send the notification to the user.
  }
}
