import type { Task } from './tasks.type';

export type TasksOptions = {
  defaultStatus: Task['status'];
};

export const TASKS_OPTIONS = Symbol('TASKS_OPTIONS'); // Symbol("TASKS_OPTIONS") !== Symbol("TASKS_OPTIONS")

export const TASKS_LABEL = Symbol('TASKS_LABEL');

export const TASKS_SERVICE_ALIAS = Symbol('TASKS_SERVICE_ALIAS');
