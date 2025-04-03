import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  currentLocation?: string;
}
