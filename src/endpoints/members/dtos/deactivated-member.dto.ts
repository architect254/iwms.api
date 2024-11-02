import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { MemberDto } from '.';

export class DeactivatedMemberDto extends MemberDto {
  @IsDate()
  @Type(() => Date)
  deactivation_date: Date;

  @IsString()
  reason: string;
}
