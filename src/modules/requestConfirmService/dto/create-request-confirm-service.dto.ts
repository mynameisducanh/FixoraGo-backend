import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class CreateRequestConfirmServiceDto {
  @IsString()
  @IsOptional()
  requestServiceId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsString()
  @IsOptional()
  price: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  
  @IsOptional()
  @IsString()
  temp?: string;
}
