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
  IsInt,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AccountStatus, AccountType } from './entities/account.entity';
import { MemberRole, MemberStatus } from '../member/member.entity';

export class CoreAccountDto {
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
  // @IsEnum(AccountStatus)
  @IsString()
  status: string;

  @IsOptional()
  // @IsEnum(AccountType)
  @IsString()
  type: string;
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
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name: string;

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
