import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Task } from './tasks.type';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_OPTIONS, type TasksOptions } from './tasks.constants';

@Injectable()
export class TasksService {
  constructor(@Inject(TASKS_OPTIONS) private readonly options: TasksOptions) {}

  private readonly tasks: Task[] = [];
  private nextId = 1;

  create(dto: CreateTasksDto) {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      status: this.options.defaultStatus,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  update(id: number, dto: UpdateTasksDto) {
    const task = this.findOne(id);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.status !== undefined) task.status = dto.status;

    return task;
  }

  remove(id: number) {
    const task = this.findOne(id);
    const index = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(index, 1);
    return task;
  }
}
