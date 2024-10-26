import { ChildEntity, Column } from 'typeorm';

import { Member, Membership } from '..';

@ChildEntity(Membership.Deceased)
export class DeceasedMember extends Member {
  @Column()
  demise_date: Date;

  constructor() {
    super();
  }
}
