import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ConfirmStatus } from 'src/database/entities/request-confirm.entity';

export class UpdateRequestConfirmDto {
  @IsOptional()
  @IsNumber()
  negotiatedPrice?: string;

  @IsOptional()
  @IsString()
  userNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;

  @IsOptional()
  @IsEnum(ConfirmStatus)
  status?: ConfirmStatus;
} 