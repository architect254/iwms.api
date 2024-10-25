import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ActiveMemberDto } from '..';

export class DeactivatedMemberDto extends ActiveMemberDto {
  @IsDate()
  @Type(() => Date)
  deactivation_date: Date;

  @IsString()
  reason: string;
}
