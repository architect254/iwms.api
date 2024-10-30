import {
  IsString,
  IsEmail,
  ValidateIf,
  IsOptional,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { MemberDto } from '../members/dtos';
import { Type } from 'class-transformer';

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
