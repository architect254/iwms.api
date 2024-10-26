
import {
  ChildEntity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Child, Membership, Spouse, User } from '..';
import { Contribution } from 'src/endpoints/contributions/contribution.entity';
import { Welfare } from 'src/endpoints/welfares/welfare.entity';

export enum Role {
  ChairPerson = 'ChairPerson',
  Treasurer = 'Treasurer',
  Secretary = 'Secretary',
  Member = 'Member',
}

@ChildEntity(Membership.Active)
export class Member extends User {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role[Role.Member],
  })
  role: Role;

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
