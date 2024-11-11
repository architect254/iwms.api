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
  Member = 'Member',
  Bereaved = 'Bereaved',
  Deceased = 'Deceased',
  Deactivated = 'Deactivated',
}

@Entity('members')
@TableInheritance({
  column: { type: 'enum', enum: Membership, name: 'membership' },
})
export class Member extends User {
  @Column({
    type: 'enum',
    enum: Membership,
    default: Membership[Membership.Active],
  })
  membership: Membership;

  @ManyToOne(() => Welfare, (welfare) => welfare.members, { eager: true })
  welfare: Welfare;

  @Column({ nullable: true })
  welfareId: string;

  @OneToMany(() => Contribution, (contributions) => contributions.member)
  contributions: Contribution[];

  @OneToOne(() => Spouse, (spouse) => spouse.spouse, { eager: true })
  @JoinColumn()
  spouse: Spouse;

  @Column({ nullable: true })
  spouseId: string;

  @OneToMany(() => Child, (children) => children.parent, { eager: true })
  children: Child[];

  constructor() {
    super();
  }
}
