import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class CreateRequestConfirmServiceDto {
  @IsNotEmpty()
  @IsString()
  requestConfirmId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ServiceType)
  type: ServiceType;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  note?: string;
} 