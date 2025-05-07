import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateIconDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    url?: string;
  
    @IsOptional()
    @IsString()
    type?: string;
  
    @IsOptional()
    @IsInt()
    idService?: string;
  }