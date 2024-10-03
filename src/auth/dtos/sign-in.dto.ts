import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
