import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WorkspacesRepository } from './workspaces.repository';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  create(name: string, userId: number) {
    return this.workspacesRepository.create(name, userId);
  }

  async createProject(workspaceId: number, name: string, userId: number) {
    await this.requireMembership(workspaceId, userId);
    return this.workspacesRepository.createProject(workspaceId, name);
  }

  list(userId: number) {
    return this.workspacesRepository.listForUser(userId);
  }

  async projects(workspaceId: number, userId: number) {
    await this.requireMembership(workspaceId, userId);
    return this.workspacesRepository.projects(workspaceId);
  }

  async addMember(workspaceId: number, email: string, userId: number) {
    const membership = await this.requireMembership(workspaceId, userId);

    if (membership.role !== 'owner') {
      throw new ForbiddenException(
        'You are not allowed to add members to the workspace',
      );
    }

    const account = await this.workspacesRepository.findAccount(email);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const added = await this.workspacesRepository.addMember(
      workspaceId,
      account.id,
    );

    if (!added) {
      throw new ConflictException('Account already a member of the workspace');
    }

    return added;
  }

  async members(workspaceId: number, userId: number) {
    await this.requireMembership(workspaceId, userId);
    return this.workspacesRepository.members(workspaceId);
  }

  private async requireMembership(workspaceId: number, userId: number) {
    const membership = await this.workspacesRepository.membership(
      workspaceId,
      userId,
    );
    if (!membership) {
      throw new NotFoundException('Workspace not found');
    }
    return membership;
  }
}
