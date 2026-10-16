import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import {
  AddWorkspaceMemberDto,
  CreateProjectDto,
  WorkspaceDto,
} from './dto/workspace.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/authenticated-request';

@ApiTags('workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workspaces', version: '1' })
export class WorkspaceController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(
    @Body() createWorkspaceDto: WorkspaceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workspacesService.create(createWorkspaceDto.name, user.id);
  }

  @Post(':workspaceId/projects')
  createProject(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workspacesService.createProject(workspaceId, dto.name, user.id);
  }

  @Get(':workspaceId/projects')
  projects(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workspacesService.projects(workspaceId, user.id);
  }

  @Post(':workspaceId/members')
  addMember(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Body() dto: AddWorkspaceMemberDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workspacesService.addMember(workspaceId, dto.email, user.id);
  }

  @Get(':workspaceId/members')
  members(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.workspacesService.members(workspaceId, user.id);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.workspacesService.list(user.id);
  }
}
