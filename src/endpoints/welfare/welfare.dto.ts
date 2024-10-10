import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';

export class WelfareDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
