import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @ApiProperty({
    description: 'Search query string',
    example: 'repair service',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Type of content to search (news or service)',
    example: 'service',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: 'news' | 'service';
} 