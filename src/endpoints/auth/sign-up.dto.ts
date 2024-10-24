import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SignInCredentialsDto } from './sign-in.dto';

export class SignUpCredentialsDto extends SignInCredentialsDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
