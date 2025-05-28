import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRevenueManagerDto {
  @IsUUID()
  userId: string;
  
  @IsOptional()
  totalRevenue?: number;

  @IsOptional()
  paidFees?: number;

  @IsOptional()
  unpaidFees?: number;

  @IsOptional()
  note?: string;
} 