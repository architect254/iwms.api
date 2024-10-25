import { Type } from 'class-transformer';
import { IsString, IsDate, IsEmail } from 'class-validator';

export class SpouseDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

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
