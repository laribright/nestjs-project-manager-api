import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Inject,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_LABEL, TASKS_SERVICE_ALIAS } from './tasks.constants';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    @Inject(TASKS_LABEL) private readonly tasksLabel: string,
    @Inject(TASKS_SERVICE_ALIAS) private readonly tasksAlias: TasksService,
  ) {
    console.log(this.tasksLabel);
    console.log(
      'Same service instance:',
      this.tasksService === this.tasksAlias,
    );
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTasksDto) {
    return this.tasksService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTasksDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
