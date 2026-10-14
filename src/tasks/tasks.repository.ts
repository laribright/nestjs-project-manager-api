import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';

import { DatabaseService } from '../database/database.service';
import { TaskRow, tasks } from '../database/schema';
import { taskEvents } from '../database/schema';

@Injectable()
export class TasksRepository {
  constructor(private readonly database: DatabaseService) {}

  async completeWithHistory(id: number): Promise<TaskRow | undefined> {
    return this.database.db.transaction(async (tx) => {
      const [task] = await tx
        .update(tasks)
        .set({ status: 'done' })
        .where(eq(tasks.id, id))
        .returning();

      if (!task) return undefined;

      await tx.insert(taskEvents).values({
        taskId: task.id,
        message: 'Task completed',
      });

      return task;
    });
  }

  history(id: number) {
    return this.database.db
      .select()
      .from(taskEvents)
      .where(eq(taskEvents.taskId, id))
      .orderBy(asc(taskEvents.id));
  }

  async create(title: string, status: TaskRow['status']): Promise<TaskRow> {
    const [task] = await this.database.db
      .insert(tasks)
      .values({ title, status })
      .returning();

    return task;
  }

  async findAll(): Promise<TaskRow[]> {
    return this.database.db.select().from(tasks).orderBy(asc(tasks.id));
  }

  async findOne(id: number): Promise<TaskRow | undefined> {
    const [task] = await this.database.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));

    return task;
  }

  async update(
    id: number,
    changes: Partial<Pick<TaskRow, 'title' | 'status'>>,
  ): Promise<TaskRow | undefined> {
    const [task] = await this.database.db
      .update(tasks)
      .set(changes)
      .where(eq(tasks.id, id))
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
}
