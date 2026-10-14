import type { TaskStatus } from '../tasks.type';
import {
  IsString,
  MaxLength,
  IsIn,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTasksDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsIn(['todo', 'done'])
  status?: TaskStatus;
}
