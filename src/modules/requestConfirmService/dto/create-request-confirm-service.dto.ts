import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ServiceType } from 'src/database/entities/request-confirm-service.entity';

export class CreateRequestConfirmServiceDto {
  @IsString()
  requestServiceId: string;

  @IsString()
  name: string;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
