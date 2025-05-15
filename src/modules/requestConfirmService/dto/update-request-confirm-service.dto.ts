import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateRequestConfirmServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
