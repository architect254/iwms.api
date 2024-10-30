import { Type } from 'class-transformer';
import { IsString, IsDate, IsEnum } from 'class-validator';

import { MemberDto } from '.';
import { RelationshipWithDeceased } from '../entities';

export class BereavedMemberDto extends MemberDto {
  @IsDate()
  @Type(() => Date)
  bereavement_date: Date;

  @IsString()
  deceased: string;

  @IsEnum(RelationshipWithDeceased)
  relationship_with_deceased: RelationshipWithDeceased;
}
