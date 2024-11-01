import {
  IsString,
  IsEmail,
  ValidateIf,
  IsOptional,
  IsNotEmptyObject,
  ValidateNested,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ChildDto, SpouseDto } from '../members/dtos';
import { Type } from 'class-transformer';
import { UserDto } from 'src/core/models/dtos/user.dto';
import { Membership, Member } from '../members/entities';

export class MemberDto extends UserDto {
  @ValidateIf((member: Member) => member.membership == Membership.Active)
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @ValidateIf((member: Member) => member.membership == Membership.Active)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];
}

export class WelfareDto {
  @ValidateIf(
    (welfare) => !(welfare.name || welfare.phone_number || welfare.email),
  )
  @IsString()
  id: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsString()
  name: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsString()
  phone_number: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsEmail()
  email: string;

  @ValidateIf((welfare) => !welfare.id)
  @IsString()
  hostname: string;

  @IsOptional()
  @IsString()
  logo_image: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MemberDto)
  chairpersonDto: MemberDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MemberDto)
  treasurerDto: MemberDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MemberDto)
  secretaryDto: MemberDto;
}
