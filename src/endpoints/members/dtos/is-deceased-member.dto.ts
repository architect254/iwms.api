import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class IsDeceasedMemberDto {
  @IsDate()
  @Type(() => Date)
  demise_date: Date;
}
