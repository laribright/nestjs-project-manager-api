import { Injectable } from '@nestjs/common';
import { asc, count, eq, ilike, SQL, and, desc } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';
import { TaskRow, tasks } from '../database/schema';
import { taskEvents } from '../database/schema';
import { ListTasksDto } from './dto/list-tasks.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly database: DatabaseService) {}

  async completeWithHistory(
    id: number,
    ownerId: number,
  ): Promise<TaskRow | undefined> {
    return this.database.db.transaction(async (tx) => {
      const [task] = await tx
        .update(tasks)
        .set({ status: 'done' })
        .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
        .returning();

      if (!task) return undefined;

      await tx.insert(taskEvents).values({
        taskId: task.id,
        message: 'Task completed',
      });

      return task;
    });
  }

  history(id: number, ownerId: number) {
    return this.database.db
      .select({
        id: taskEvents.id,
        taskId: taskEvents.taskId,
        message: taskEvents.message,
        createdAt: taskEvents.createdAt,
      })
      .from(taskEvents)
      .innerJoin(tasks, eq(tasks.id, taskEvents.taskId))
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .orderBy(asc(taskEvents.id));
  }

  async create(
    title: string,
    status: TaskRow['status'],
    ownerId: number,
  ): Promise<TaskRow> {
    const [task] = await this.database.db
      .insert(tasks)
      .values({ title, status, ownerId })
      .returning();

    return task;
  }

  async findAll(ownerId: number): Promise<TaskRow[]> {
    return this.database.db
      .select()
      .from(tasks)
      .where(eq(tasks.ownerId, ownerId))
      .orderBy(asc(tasks.id));
  }

  async findOne(id: number, ownerId: number): Promise<TaskRow | undefined> {
    const [task] = await this.database.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .limit(1);

    return task;
  }

  async update(
    id: number,
    changes: Partial<Pick<TaskRow, 'title' | 'status'>>,
    ownerId: number,
  ): Promise<TaskRow | undefined> {
    const [task] = await this.database.db
      .update(tasks)
      .set(changes)
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .returning();

    return task;
  }

  async remove(id: number): Promise<TaskRow | undefined> {
    const [task] = await this.database.db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    return task;
  }

  async list(query: ListTasksDto, ownerId: number) {
    const { page, limit, status, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;
    const search = query.search?.trim();
    const filters: SQL[] = [eq(tasks.ownerId, ownerId)];

    if (status) filters.push(eq(tasks.status, status));
    if (search) filters.push(ilike(tasks.title, `%${search}%`));

    const where = filters.length > 0 ? and(...filters) : undefined;
    const column = sortBy === 'title' ? tasks.title : tasks.id;
    const direction = sortOrder === 'desc' ? desc : asc;

    const items = await this.database.db
      .select()
      .from(tasks)
      .where(where)
      .orderBy(direction(column), direction(tasks.id))
      .limit(limit)
      .offset(offset);

    const [result] = await this.database.db
      .select({ total: count() })
      .from(tasks)
      .where(where);

    return {
      items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
