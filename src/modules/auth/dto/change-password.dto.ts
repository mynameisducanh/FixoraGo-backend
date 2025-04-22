
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @MinLength(8)
  @MaxLength(25)
  currentPassword: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(25)
  newPassword: string;
}
