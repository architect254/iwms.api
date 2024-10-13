import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsObject,
  ValidateNested,
  IsArray,
  IsOptional,
  IsNumber,
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
}
export class MembershipDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
export class SpouseDto {
  @IsOptional()
  @IsNumber()
  spouseId: number;

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
  @IsOptional()
  @IsNumber()
  childId: number;

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
export class WelfareDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  logo_image: string;
}
export class CreateUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CoreUserDto)
  userDto: CoreUserDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MembershipDto)
  membershipDto: MembershipDto;

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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}
export class UpdateUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CoreUserDto)
  userDto: CoreUserDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MembershipDto)
  membershipDto: MembershipDto;

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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}
export class SearchQueryDto {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  id_number: string;

  @IsOptional()
  @IsDate()
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;

  @IsOptional()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  groupId: number;
}
