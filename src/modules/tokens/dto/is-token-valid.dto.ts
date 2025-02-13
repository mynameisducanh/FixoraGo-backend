import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IsTokenValidDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
