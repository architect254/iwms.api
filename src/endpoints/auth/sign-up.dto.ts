import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsStrongPassword,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { SignInCredentialsDto } from './sign-in.dto';

export class SignUpCredentialsDto extends SignInCredentialsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  id_number: string;

  @IsNotEmpty()
  @IsDate()
  @Transform((date) => new Date(date.value))
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
