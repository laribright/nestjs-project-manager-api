import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListTasksDto {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
    maximum: 10000,
    description: 'The page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsIn(['todo', 'done'])
  status?: 'todo' | 'done';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsIn(['id', 'title'])
  sortBy?: 'id' | 'title' = 'id';

  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
