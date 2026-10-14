import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTasksDto {
  @ApiPropertyOptional({
    default: 'Buy groceries',
    maxLength: 20,
    description: 'The title of the task',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title!: string;
}
