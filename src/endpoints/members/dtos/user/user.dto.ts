import { IsString, IsEmail, IsDate, IsEnum, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

import { Gender, Membership, Role, User } from '../../entities';

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

  @IsEnum(Membership)
  membership: Membership;

  @ValidateIf((user: User) => user.membership == Membership.Active)
  @IsEnum(Role)
  role: Role;
}

export class SearchQueryDto {
  @IsEnum(Membership)
  membership: Membership;
}
