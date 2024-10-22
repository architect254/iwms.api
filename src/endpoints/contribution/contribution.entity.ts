import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Member } from '../member/member.entity';

export enum ContributionType {
  Membership = 'Membership',
  Monthly = 'Monthly',
  BereavedMember = 'Bereaved Member',
  DeceasedMember = 'Deceased Member',
  MembershipReActivation = 'Membership Re-Activation',
}

export abstract class Contribution {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.Monthly],
  })
  type: ContributionType;

  @Column(() => Transaction)
  transaction: Transaction;

  @ManyToOne(() => Member)
  from_member: Member;

  @OneToOne(() => Member)
  for_member: Member;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}

@Entity('membership contributions')
export class MembershipContribution extends Contribution {
  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.Membership],
  })
  type: ContributionType;

  @ManyToOne(() => Member, (member) => member.membership_contributions)
  from_member: Member;

  @ManyToOne(() => Member)
  for_member: Member;

  constructor() {
    super();
  }
}

@Entity('monthly contributions')
export class MonthlyContribution extends Contribution {
  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.Monthly],
  })
  type: ContributionType;

  @Column({ nullable: false })
  for_month: Date;

  @ManyToOne(() => Member, (member) => member.monthly_contributions)
  from_member: Member;

  @ManyToOne(() => Member)
  for_member: Member;

  constructor() {
    super();
  }
}

@Entity('bereaved member contributions')
export class BereavedMemberContribution extends Contribution {
  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.BereavedMember],
  })
  type: ContributionType;

  @ManyToOne(() => Member, (member) => member.bereaved_member_contributions)
  from_member: Member;

  @ManyToOne(() => Member)
  for_member: Member;

  constructor() {
    super();
  }
}

@Entity('deceased member contributions')
export class DeceasedMemberContribution extends Contribution {
  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.DeceasedMember],
  })
  type: ContributionType;

  @ManyToOne(() => Member, (member) => member.deceased_member_contributions)
  from_member: Member;

  @ManyToOne(() => Member)
  for_member: Member;

  constructor() {
    super();
  }
}

@Entity('membership re-activation contributions')
export class MembershipReactivationContribution extends Contribution {
  @Column({
    type: 'enum',
    enum: ContributionType,
    default: ContributionType[ContributionType.MembershipReActivation xcv ],
  })
  type: ContributionType;

  @ManyToOne(
    () => Member,
    (member) => member.membership_reactivation_contributions,
  )
  from_member: Member;

  @ManyToOne(() => Member)
  for_member: Member;

  constructor() {
    super();
  }
}
