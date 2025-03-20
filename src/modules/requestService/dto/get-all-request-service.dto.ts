import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class GetAllRequestServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  isStaff: boolean;
}
