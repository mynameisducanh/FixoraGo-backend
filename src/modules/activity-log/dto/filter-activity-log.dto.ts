import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ActivityType } from '../../../database/entities/activity-log.entity';
export enum TimeSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  NEAREST = 'nearest',
  URGENT = 'urgent',
  EXPIRINGSOON = 'expiring-soon',
}
export class FilterActivityLogDto {
  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  activityType: string;

  @IsOptional()
  @IsEnum(TimeSort)
  sortTime?: TimeSort;

  @IsString()
  @IsOptional()
  fixerId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  temp?: string;
}
