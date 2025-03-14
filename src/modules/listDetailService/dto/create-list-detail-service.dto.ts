import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateIconDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  unit:string;
  
  @IsString()
  @IsOptional()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  service_id: number;
}
