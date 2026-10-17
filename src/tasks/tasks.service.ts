import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_OPTIONS, type TasksOptions } from './tasks.constants';
import { TasksRepository } from './tasks.repository';
import { TaskRow } from '../database/schema';
import { ListTasksDto } from './dto/list-tasks.dto';
import { TaskCreatedEvent } from './task-created.event';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_OPTIONS) private readonly options: TasksOptions,
    private readonly tasksRepository: TasksRepository,
    private readonly events: EventEmitter2,
  ) {}

  async complete(id: number, ownerId: number): Promise<TaskRow> {
    const task = await this.tasksRepository.completeWithHistory(id, ownerId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async history(id: number, ownerId: number) {
    await this.findOne(id, ownerId);
    return this.tasksRepository.history(id, ownerId);
  }

  async create(dto: CreateTasksDto, ownerId: number) {
    const task = await this.tasksRepository.create(
      dto.title,
      this.options.defaultStatus,
      ownerId,
    );

    await this.events.emitAsync(
      'task.created',
      new TaskCreatedEvent(task.id, ownerId),
    );

    return task;
  }

  list(query: ListTasksDto, ownerId: number) {
    return this.tasksRepository.list(query, ownerId);
  }

  async findAll(ownerId: number) {
    return this.tasksRepository.findAll(ownerId);
  }

  async findOne(id: number, ownerId: number): Promise<TaskRow | undefined> {
    const task = await this.tasksRepository.findOne(id, ownerId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number,
    dto: UpdateTasksDto,
    ownerId: number,
  ): Promise<TaskRow | undefined> {
    const changes: Partial<Pick<TaskRow, 'title' | 'status'>> = {};

    if (dto.title !== undefined) changes.title = dto.title;
    if (dto.status !== undefined) changes.status = dto.status;

    if (Object.keys(changes).length === 0) return this.findOne(id, ownerId);

    const task = await this.tasksRepository.update(id, changes, ownerId);

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
