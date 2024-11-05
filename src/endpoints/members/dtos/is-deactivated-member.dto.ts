import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class IsDeactivatedMemberDto {
  @IsString()
  reason: string;
}
