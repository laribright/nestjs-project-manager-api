import { ApiProperty } from '@nestjs/swagger';

export class TasksResponseDto {
  @ApiProperty({ type: 'integer', example: 1 })
  id!: number;

  @ApiProperty({ type: 'string', example: 'Buy groceries' })
  title!: string;

  @ApiProperty({ enum: ['todo', 'done'] })
  status!: 'todo' | 'done';
}

export class PageMetaDto {
  @ApiProperty({ type: 'integer', example: 1 })
  page!: number;

  @ApiProperty({ type: 'integer', example: 10 })
  limit!: number;

  @ApiProperty({ type: 'integer', example: 100 })
  total!: number;

  @ApiProperty({ type: 'integer', example: 1 })
  totalPages!: number;
}

export class TasksPageDto {
  @ApiProperty({ type: () => TasksResponseDto, isArray: true })
  items!: TasksResponseDto[];

  @ApiProperty({ type: () => PageMetaDto })
  meta!: PageMetaDto;
}

export class TasksPageResponseDto {
  @ApiProperty({ type: () => TasksPageDto })
  data!: TasksPageDto;
}
