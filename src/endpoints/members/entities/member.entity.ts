
import {
  ChildEntity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Entity,
  TableInheritance,
} from 'typeorm';

import { Child, Spouse } from '.';
import { Contribution } from 'src/endpoints/contributions/contribution.entity';
import { Welfare } from 'src/endpoints/welfares/welfare.entity';
import { User } from 'src/core/models/entities/user.entity';

export enum Membership {
  Active = 'Active',
  Bereaved = 'Bereaved',
  Deceased = 'Deceased',
  Deactivated = 'Deactivated',
}

@Entity('memberships')
@TableInheritance({
  column: { type: 'enum', enum: Membership, name: 'membership' },
})export class Member extends User {
  @Column({
    type: 'enum',
    enum: Membership,
    default: Membership[Membership.Active],
  })
  membership: Membership;

  @ManyToOne(() => Welfare, (welfare) => welfare.members, { eager: true })
  welfare: Welfare;

  @OneToMany(() => Contribution, (from) => from.from)
  from: Contribution[];

  @OneToMany(() => Contribution, (to) => to.to)
  to: Contribution[];

  @OneToOne(() => Spouse, (spouse) => spouse.spouse, { eager: true })
  @JoinColumn()
  spouse: Spouse;

  @OneToMany(() => Child, (children) => children.parent, { eager: true })
  children: Child[];

  constructor() {
    super();
  }
}
