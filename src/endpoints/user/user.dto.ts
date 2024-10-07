import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsObject,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CoreUserDto {
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
  @IsDate()
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  group_id: string;
}
export class SpouseDto {
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
  @IsDate()
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class ChildDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsDate()
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;
}
export class UserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CoreUserDto)
  userDto: CoreUserDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];
}
