import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class UpdateRequestConfirmServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  note?: string;
} 