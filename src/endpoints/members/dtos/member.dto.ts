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
import { Membership } from '../entities';
import { UserDto } from 'src/core/models/dtos/user.dto';

export class MemberDto extends UserDto {
  @IsEnum(Membership)
  membership: Membership;

  @IsString()
  welfareId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpouseDto)
  spouseDto: SpouseDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  childrenDto: ChildDto[];
}

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  membership: string;
}
