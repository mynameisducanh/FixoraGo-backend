import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateRequestServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId: number;

  @ApiPropertyOptional()
  staffId: number;

  @ApiPropertyOptional()
  @IsOptional()
  typeService: string;

  @ApiPropertyOptional()
  @IsOptional()
  nameService: string;

  @ApiPropertyOptional()
  @IsOptional()
  listDetailService: string;

  @ApiPropertyOptional()
  @IsOptional()
  priceService: string;

  @ApiPropertyOptional()
  @IsOptional()
  note: string;
}
