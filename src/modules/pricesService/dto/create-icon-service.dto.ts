import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePricesServiceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  serviceId: number;

  @ApiPropertyOptional()
  @IsOptional()
  unitService: string;

  @IsString()
  @IsOptional()
  price: string;

  @ApiPropertyOptional()
  @IsOptional()
  min_price: string;

  @ApiPropertyOptional()
  @IsOptional()
  max_price: string;

  @ApiProperty()
  imageUrl: Express.Multer.File;
}
