import { ChildEntity, Column } from 'typeorm';

import { ActiveMember, Membership } from '..';

@ChildEntity(Membership.Deactivated)
export class DeactivatedMember extends ActiveMember {
  @Column()
  deactivation_date: Date;

  @Column()
  reason: string;

  constructor() {
    super();
  }
}
