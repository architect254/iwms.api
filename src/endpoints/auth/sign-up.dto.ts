import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsStrongPassword,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SignInCredentialsDto } from './sign-in.dto';

export class SignUpCredentialsDto extends SignInCredentialsDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  id_number: string;

  @IsNotEmpty()
  @IsString()
  birth_date: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
