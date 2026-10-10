import type { TaskStatus } from '../tasks.type';

export class UpdateTasksDto {
  title?: string;
  status?: TaskStatus;
}
