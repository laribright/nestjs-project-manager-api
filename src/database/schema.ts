import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const taskStatus = pgEnum('task_status', ['todo', 'done']);

export const tasks = pgTable('tasks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 20 }).notNull(),
  status: taskStatus('status').notNull().default('todo'),
});

export const taskEvents = pgTable(
  'task_events',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('task_events_task_id_idx').on(table.taskId)], // Helps the database to optimize the query
);

export type TaskRow = typeof tasks.$inferSelect;
// export type NewTaskRow = typeof tasks.$inferInsert;
