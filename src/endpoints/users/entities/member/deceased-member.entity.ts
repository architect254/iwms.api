import { ChildEntity, Column } from 'typeorm';

import { ActiveMember, Membership } from '..';

@ChildEntity(Membership.Deceased)
export class DeceasedMember extends ActiveMember {
  @Column()
  demise_date: Date;

  constructor() {
    super();
  }
}
