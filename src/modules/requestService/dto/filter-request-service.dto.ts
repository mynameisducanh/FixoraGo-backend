import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum TimeSort {
  NEWEST = 'newest',
  NEAREST = 'nearest',
  URGENT = 'urgent',
  EXPIRINGSOON = 'expiring-soon',
}

export enum TimeFilter {
  ALL = 'Tất cả',
  TODAY = 'Hôm nay',
  TOMORROW = 'Ngày mai',
  THIS_WEEK = 'Tuần này',
  THIS_MONTH = 'Tháng này',
}

export class FilterRequestServiceDto {
  @IsOptional()
  @IsEnum(TimeSort)
  sortTime?: TimeSort;

  @IsOptional()
  @IsString()
  nameService?: string;

  @IsOptional()
  @IsString()
  districts?: string;

  @IsOptional()
  @IsEnum(TimeFilter)
  time?: TimeFilter;
}
