import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;

  @ApiProperty()
  @IsString()
  roles: string;
} 