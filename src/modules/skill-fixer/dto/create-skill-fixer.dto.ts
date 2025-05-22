import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateSkillFixerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  temp?: string;
}

export class CreateMultipleSkillsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ 
    required: true,
    description: 'Array of skill names',
    example: ['Sửa điện lạnh', 'Sửa ống nước']
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  skills: string[];
} 