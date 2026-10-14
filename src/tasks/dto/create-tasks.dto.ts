import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTasksDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title!: string;
}
