import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum TimeSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class FilterRequestServiceDto {
  @IsOptional()
  @IsEnum(TimeSort)
  sortTime?: TimeSort;

  @IsOptional()
  @IsString()
  nameService?: string;
}
