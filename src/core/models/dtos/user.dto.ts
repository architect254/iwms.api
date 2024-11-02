import { IsString, IsEmail, IsDate, IsEnum, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../entities/user.entity';

export class UserDto {
  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  id_number: string;

  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;
}
