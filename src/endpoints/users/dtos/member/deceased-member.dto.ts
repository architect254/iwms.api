import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { ActiveMember } from '../../entities';

export class DeceasedMemberDto extends ActiveMember {
  @IsDate()
  @Type(() => Date)
  demise_date: Date;
}
