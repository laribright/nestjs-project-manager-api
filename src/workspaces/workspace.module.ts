import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesRepository } from './workspaces.repository';
import { WorkspaceController } from './workspace.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [WorkspaceController],
  providers: [WorkspacesService, WorkspacesRepository],
  exports: [WorkspacesService],
})
export class WorkspaceModule {}
