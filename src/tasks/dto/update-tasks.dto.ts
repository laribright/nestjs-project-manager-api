import type { TaskStatus } from '../tasks.type';
import {
  IsString,
  MaxLength,
  IsIn,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTasksDto {
  @ApiPropertyOptional({
    default: 'Buy groceries',
    maxLength: 20,
    description: 'The title of the task',
    example: 'Buy groceries example',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    default: 'todo',
    enum: ['todo', 'done'],
    description: 'The status of the task',
    example: 'done',
  })
  @IsOptional()
  @IsIn(['todo', 'done'])
  status?: TaskStatus;
}
