import { IsNotEmpty, IsString, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import { SignInCredentialsDto } from './sign-in.dto';
import { Gender } from '../users/entities';

export class SignUpCredentialsDto extends SignInCredentialsDto {
  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;
}
