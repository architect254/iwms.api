import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  TableInheritance,
  ChildEntity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BereavedMember, DeceasedMember, Member } from '../members/entities';
import { Account } from '../finance/entities';

export enum ContributionType {
  Membership = 'Membership',
  Monthly = 'Monthly',
  BereavedMember = 'Bereaved Member',
  DeceasedMember = 'Deceased Member',
  MembershipReactivation = 'Membership Reactivation',
}

@Entity('contributions')
@TableInheritance({
  column: { type: 'enum', enum: ContributionType, name: 'type' },
})
export abstract class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContributionType,
  })
  type: ContributionType;

  @Column({ default: 0 })
  amount: number;

  @ManyToOne(() => Member, (member) => member.contributions)
  @JoinColumn()
  member: Member;

  @ManyToOne(() => Account, (account) => account.contributions)
  @JoinColumn()
  account: Account;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}

@ChildEntity(ContributionType.Membership)
export class MembershipContribution extends Contribution {
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.Monthly)
export class MonthlyContribution extends Contribution {
  @Column()
  for_month: Date;
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.BereavedMember)
export class BereavedMemberContribution extends Contribution {
  @ManyToOne(
    () => BereavedMember,
    (bereavedMember) => bereavedMember.contributions,
  )
  @JoinColumn()
  bereavedMember: BereavedMember;

  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.DeceasedMember)
export class DeceasedMemberContribution extends Contribution {
  @ManyToOne(
    () => DeceasedMember,
    (deceasedMember) => deceasedMember.contributions,
  )
  @JoinColumn()
  deceasedMember: DeceasedMember;
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.MembershipReactivation)
export class MembershipReactivationContribution extends Contribution {
  constructor() {
    super();
  }
}
