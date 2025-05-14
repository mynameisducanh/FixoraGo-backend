import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestConfirmDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  staffId: string;

  @IsNotEmpty()
  @IsString()
  requestServiceId: string;

  // @IsNotEmpty()
  proposedPrice: string;

  @IsOptional()
  negotiatedPrice?: string;

  @IsOptional()
  @IsString()
  userNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;
} 