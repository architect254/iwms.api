import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  ValidateNested,
  ValidateIf,
  IsArray,
  IsObject,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChildDto, SpouseDto } from '.';
import { Member, Membership } from '../entities';
import { WelfareDto } from '../../welfares/welfare.dto';
import { UserDto } from 'src/core/models/dtos/user.dto';

export class MemberDto extends UserDto {
  @IsEnum(Membership)
  membership: Membership;

  @ValidateIf((member: Member) => member.membership == Membership.Active)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @ValidateIf((member: Member) => member.membership == Membership.Active)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];

  @ValidateIf((member: Member) => member.membership == Membership.Active)
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  membership: string;
}
