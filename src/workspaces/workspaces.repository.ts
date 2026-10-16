import { Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';
import {
  projects,
  users,
  workspaceMembers,
  workspaces,
} from '../database/schema';

@Injectable()
export class WorkspacesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(name: string, userId: number) {
    return this.databaseService.db.transaction(async (tx) => {
      const [workspace] = await tx
        .insert(workspaces)
        .values({ name })
        .returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        userId,
        role: 'owner',
      });

      return workspace;
    });
  }

  listForUser(userId: number) {
    return this.databaseService.db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspaceMembers.role,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaceMembers.userId, userId))
      .orderBy(asc(workspaces.id));
  }

  async membership(workspaceId: number, userId: number) {
    const [membership] = await this.databaseService.db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId),
        ),
      )
      .limit(1);

    return membership;
  }

  async findAccount(email: string) {
    const [user] = await this.databaseService.db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async addMember(workspaceId: number, userId: number) {
    const [membership] = await this.databaseService.db
      .insert(workspaceMembers)
      .values({
        workspaceId,
        userId,
        role: 'member',
      })
      .onConflictDoNothing()
      .returning();

    return membership;
  }

  async members(workspaceId: number) {
    return this.databaseService.db
      .select({
        id: users.id,
        email: users.email,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId))
      .orderBy(asc(users.id));
  }

  async createProject(workspaceId: number, name: string) {
    const [project] = await this.databaseService.db
      .insert(projects)
      .values({
        workspaceId,
        name,
      })
      .returning();

    return project;
  }

  async projects(workspaceId: number) {
    return this.databaseService.db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(asc(projects.id));
  }
}
