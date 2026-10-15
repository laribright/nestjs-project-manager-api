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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { TASKS_LABEL, TASKS_SERVICE_ALIAS } from './tasks.constants';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/authenticated-request';
import { ListTasksDto } from './dto/list-tasks.dto';
import { TasksPageResponseDto } from './dto/tasks-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller({ path: 'tasks', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
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

  // This was the old way of doing it, now we use the DTOs
  // @ApiOkResponse({
  //   description: 'A page of tasks inside data object',
  //   schema: {
  //     type: 'object',
  //     required: ['data'],
  //     properties: {
  //       data: {
  //         type: 'object',
  //         required: ['items', 'meta'],
  //         properties: {
  //           items: {
  //             type: 'array',
  //             items: {
  //               type: 'object',
  //               required: ['id', 'title', 'status'],
  //               properties: {
  //                 id: { type: 'integer', example: 1 },
  //                 title: { type: 'string', example: 'Buy groceries' },
  //                 status: { type: 'string', example: 'todo' },
  //               },
  //             },
  //           },
  //           meta: {
  //             type: 'object',
  //             required: ['total', 'page', 'limit', 'totalPages'],
  //             properties: {
  //               total: { type: 'integer', example: 100 },
  //               page: { type: 'integer', example: 1 },
  //               limit: { type: 'integer', example: 10 },
  //               totalPages: { type: 'integer', example: 10 },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  @Get()
  @ApiOperation({
    summary: 'List tasks with pagination, filtering and sorting',
  })
  @ApiOkResponse({
    description: 'A page of tasks inside data object',
    type: TasksPageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(@Query() query: ListTasksDto, @CurrentUser() user: AuthUser) {
    // orderBy, limit, offset
    return this.tasksService.list(query, user.id);
  }

  @Post()
  create(@Body() dto: CreateTasksDto, @CurrentUser() user: AuthUser) {
    console.log('TASK CONTROLLER: create');
    console.log('[Current user]:', user);
    return this.tasksService.create(dto, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTasksDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }

  @Patch(':id/complete')
  complete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.complete(id, user.id);
  }

  @Get(':id/history')
  history(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tasksService.history(id, user.id);
  }
}
