import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePricesServiceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  serviceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  unitService: string;

  @IsString()
  @IsOptional()
  time: string;

  @ApiProperty()
  imageUrl: Express.Multer.File;
}
