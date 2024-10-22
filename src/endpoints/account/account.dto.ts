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

export class CoreAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

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
  // @IsEnum(AccountStatus)
  @IsString()
  state: string;

  @IsOptional()
  // @IsEnum(AccountType)
  @IsString()
  class: string;
}
export class SpouseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

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
  name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsDate()
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;
}
export class MemberDto {
  @IsOptional()
  // @IsEnum(MemberRole)
  @IsString()
  role: string;

  @IsOptional()
  // @IsEnum(MemberStatus)
  @IsString()
  status: string;
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
export class CreateAccountDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CoreAccountDto)
  accountDto: CoreAccountDto;

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
  @Type(() => MemberDto)
  memberDto: MemberDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}
export class UpdateAccountDto {
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @ValidateNested()
  @Type(() => CoreAccountDto)
  accountDto: CoreAccountDto;

  @IsOptional()
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];

  @IsOptional()
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @ValidateNested()
  @Type(() => MemberDto)
  memberDto: MemberDto;

  @IsOptional()
  @Transform(
    ({ value }) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}
export class SearchQueryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  id_number: string;

  @IsOptional()
  @IsDate()
  birth_date: Date;

  @IsOptional()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsEmail()
  email: string;

  // @IsOptional()
  // // @IsEnum(AccountStatus)
  // @IsString()
  // status: string;

  // @IsOptional()
  // // @IsEnum(AccountType)
  // @IsString()
  // type: string;

  // @IsOptional()
  // // @IsEnum(MemberRole)
  // @IsString()
  // role: string;

  // @IsOptional()
  // // @IsEnum(MemberStatus)
  // @IsString()
  // m_status: string;

  @IsOptional()
  @IsNumber()
  groupId: number;
}
