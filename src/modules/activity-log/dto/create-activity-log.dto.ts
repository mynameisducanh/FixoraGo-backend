import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ActivityType } from '../../../database/entities/activity-log.entity';

export class CreateActivityLogDto {
  @IsString()
  @IsOptional()
  activityType: string;

  @IsString()
  @IsOptional()
  fixerId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  requestServiceId?: string;

  @IsString()
  @IsOptional()
  requestConfirmId?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  longitude?: string;

  @IsString()
  @IsOptional()
  temp?: string;
}
