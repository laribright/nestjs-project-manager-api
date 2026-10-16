import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class WorkspaceDto {
  @ApiProperty({
    example: 'Codewithlari Team',
    maxLength: 100,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class CreateProjectDto extends WorkspaceDto {}

export class AddWorkspaceMemberDto {
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email: string;
}
