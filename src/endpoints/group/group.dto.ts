import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
