import { IsString, IsOptional } from 'class-validator';

export class UpdateRequestServiceDto {
  @IsString()
  @IsOptional()
  nameService?: string;

  @IsOptional()
  listDetailService?: string[];

  @IsOptional()
  priceService?: string;

  @IsString()
  @IsOptional()
  typeEquipment?: string;

  @IsString()
  @IsOptional()
  calender?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  note?: string;
} 