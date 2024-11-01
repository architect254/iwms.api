import { ChildEntity, Column } from 'typeorm';

import { Member, Membership } from '.';

@ChildEntity(Membership.Deactivated)
export class DeactivatedMember extends Member {
  @Column({
    type: 'enum',
    enum: Membership,
    default: Membership[Membership.Deactivated],
  })
  membership: Membership;

  @Column()
  deactivation_date: Date;

  @Column()
  reason: string;

  constructor() {
    super();
  }
}
