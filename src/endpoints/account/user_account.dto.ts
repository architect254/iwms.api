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
  Length,
  IsInt,
  Max,
  Min,
  IsNotEmptyObject,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  AccountType,
  Gender,
  Role,
  State,
  Status,
  UserAccount,
} from './entities/user_account.entity';

export class SpouseDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  id_number: string;

  @IsDate()
  @Type(() => Date)
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;

  @IsString()
  phone_number: string;

  @IsEmail()
  email: string;
}

export class ChildDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsDate()
  @Type(() => Date)
  @Transform((field) => new Date(field.value))
  birth_date: Date;
}

export class WelfareDto {
  @IsOptional()
  @IsString()
  id: string;

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
  @IsString()
  logo_image: string;
}

export class CreateUserAccountDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsEnum(() => Gender)
  @Transform((field) => Gender[field.value])
  gender: string;

  @IsString()
  id_number: string;

  @IsDate({ message: 'Invalid date format' })
  @Type(() => Date)
  @Transform((birth_date) => new Date(birth_date.value))
  birth_date: Date;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsString()
  phone_number: string;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Admin)
  @IsEmail()
  email: string;

  @IsEnum(() => State)
  @Transform((field) => State[field.value])
  state: State;

  @IsEnum(() => AccountType)
  @Transform((field) => AccountType[field.value])
  type: AccountType;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsEnum(() => Role)
  @Transform((field) => Role[field.value])
  role: Role;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsEnum(() => Status)
  @Transform((field) => Status[field.value])
  status: Status;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];

  @ValidateIf((user: UserAccount) => user.type == AccountType.Client)
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}

export class UpdateUserAccountDto extends CreateUserAccountDto {}

export class SearchQueryDto {}
