import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFixerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  employeeCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastCheckIn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  insurance?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expiry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  revenue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tax?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  timezone?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  temp?: string;
} 