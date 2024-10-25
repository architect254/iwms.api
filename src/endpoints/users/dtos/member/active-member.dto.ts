import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  ValidateNested,
  ValidateIf,
  IsArray,
  IsObject,
} from 'class-validator';
import { ChildDto, SpouseDto, UserDto } from '..';
import { Membership, User } from '../../entities';
import { WelfareDto } from 'src/endpoints/welfare/welfare.dto';

export class ActiveMemberDto extends UserDto {
  @ValidateIf((user: User) => user.membership == Membership.Active)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @ValidateIf((user: User) => user.membership == Membership.Active)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];

  @ValidateIf((user: User) => user.membership == Membership.Active)
  @IsObject()
  @ValidateNested()
  @Type(() => WelfareDto)
  welfareDto: WelfareDto;
}
