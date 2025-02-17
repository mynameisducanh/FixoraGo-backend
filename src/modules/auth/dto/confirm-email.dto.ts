import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
