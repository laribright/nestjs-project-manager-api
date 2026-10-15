import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token to refresh',
  })
  @IsString()
  @MaxLength(200)
  @MinLength(1)
  refreshToken: string;
}
