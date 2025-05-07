import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateIconDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()

  @IsString()
  @IsOptional()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  idService: string;

  @ApiProperty()
  file: Express.Multer.File;
}
