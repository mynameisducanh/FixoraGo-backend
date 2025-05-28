import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRevenueManagerDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsOptional()
  totalRevenue?: number;

  @IsOptional()
  paidFees?: number;

  @IsOptional()
  unpaidFees?: number;

  @IsOptional()
  note?: string;

  @IsOptional()
  status?: string;
}
