import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLottieIconDto {
  @ApiProperty()
  files: Express.Multer.File;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;
}
