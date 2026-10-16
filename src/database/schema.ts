import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const taskStatus = pgEnum('task_status', ['todo', 'done']);

export const tasks = pgTable('tasks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 20 }).notNull(),
  status: taskStatus('status').notNull().default('todo'),
  ownerId: integer('owner_id').references(() => users.id),
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

export const userRole = pgEnum('user_role', ['admin', 'member']);

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 254 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRole('role').notNull().default('member'),
});

export type UserRow = typeof users.$inferSelect;
// export type NewUserRow = typeof users.$inferInsert;

export const refreshSesssions = pgTable('refresh_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const workspaceRole = pgEnum('workspace_role', ['owner', 'member']);

export const workspaces = pgTable('workspaces', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
});

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    role: workspaceRole('role').notNull().default('member'),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.userId] }),
    index('workspace_members_user_idx').on(table.userId),
  ],
);

export const projects = pgTable(
  'projects',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
  },
  (table) => [index('projects_workspace_idx').on(table.workspaceId)],
);
