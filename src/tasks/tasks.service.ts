import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_OPTIONS, type TasksOptions } from './tasks.constants';
import { TasksRepository } from './tasks.repository';
import { TaskRow } from '../database/schema';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_OPTIONS) private readonly options: TasksOptions,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async complete(id: number): Promise<TaskRow> {
    const task = await this.tasksRepository.completeWithHistory(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async history(id: number) {
    await this.findOne(id);
    return this.tasksRepository.history(id);
  }

  create(dto: CreateTasksDto) {
    return this.tasksRepository.create(
      dto.title,
      this.options.defaultStatus,
    );
  }

  findAll(): Promise<TaskRow[]> {
    return this.tasksRepository.findAll();
  }

  async findOne(id: number): Promise<TaskRow | undefined> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, dto: UpdateTasksDto): Promise<TaskRow | undefined> {
    const changes: Partial<Pick<TaskRow, 'title' | 'status'>> = {};

    if (dto.title !== undefined) changes.title = dto.title;
    if (dto.status !== undefined) changes.status = dto.status;

    if (Object.keys(changes).length === 0) return this.findOne(id);

    const task = await this.tasksRepository.update(id, changes);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(id: number) {
    const task = await this.tasksRepository.remove(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
