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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_LABEL, TASKS_SERVICE_ALIAS } from './tasks.constants';
import { DemoAuthGuard } from '../common/guards/demo-auth-guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { DemoUser } from '../common/types/authenticated-request';

@Controller('tasks')
@UseGuards(DemoAuthGuard, RolesGuard)
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
  @Roles('admin')
  create(@Body() dto: CreateTasksDto, @CurrentUser() user: DemoUser) {
    console.log('TASK CONTROLLER: create');
    console.log('[Current user]:', user);
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

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.complete(id);
  }

  @Get(':id/history')
  history(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.history(id);
  }
}
