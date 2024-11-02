import { ChildEntity, Column } from 'typeorm';

import { Member, Membership } from '.';

@ChildEntity(Membership.Deceased)
export class DeceasedMember extends Member {
  @Column({
    type: 'enum',
    enum: Membership,
    default: Membership[Membership.Deceased],
  })
  membership: Membership;

  @Column()
  demise_date: Date;

  constructor() {
    super();
  }
}
