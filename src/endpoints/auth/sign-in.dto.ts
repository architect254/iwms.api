import { IsString } from 'class-validator';
import { IsValidPassword } from './password.validator';

export class SignInCredentialsDto {
  @IsString()
  id_number: string;

  @IsString()
  password: string;
}
