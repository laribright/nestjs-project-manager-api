import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ClockService } from '../common/clock.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly clockService: ClockService,
    private readonly mailService: MailService,
  ) {}

  async summary() {
    const tasks = await this.tasksService.findAll();
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'done').length,
      generatedAt: this.clockService.now().toISOString(),
    };
  }

  previewEmail() {
    return this.mailService.preview('test@example.com', 'Test Email');
  }
}
