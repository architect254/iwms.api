import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { Member } from '../entities';

export class DeceasedMemberDto extends Member {
  @IsDate()
  @Type(() => Date)
  demise_date: Date;
}
