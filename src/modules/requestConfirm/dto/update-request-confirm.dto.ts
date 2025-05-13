import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ConfirmStatus } from 'src/database/entities/request-confirm.entity';

export class UpdateRequestConfirmDto {
  @IsOptional()
  @IsString()
  negotiatedPrice?: string;

  @IsOptional()
  @IsString()
  userNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;

  @IsOptional()
  @IsEnum(ConfirmStatus)
  userVerified?: ConfirmStatus;

  @IsOptional()
  @IsEnum(ConfirmStatus)
  staffVerified?: ConfirmStatus;
} 