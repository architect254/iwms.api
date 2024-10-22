import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Welfare } from '../welfare/welfare.entity';
import { Account } from '../account/entities/account.entity';
import {
  BereavedMemberContribution,
  DeceasedMemberContribution,
  MembershipContribution,
  MembershipReactivationContribution,
  MonthlyContribution,
} from '../contribution/contribution.entity';

export enum MemberRole {
  Manager = 'Manager',
  Accountant = 'Accountant',
  Secretary = 'Secretary',
  Member = 'Member',
}

export enum MemberStatus {
  Bereaved = 'Bereaved',
  Deceased = 'Deceased',
  Deactivated = 'Deactivated',
  Normal = 'Normal',
}

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole[MemberRole.Member],
  })
  role: MemberRole;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus[MemberStatus.Normal],
  })
  status: MemberStatus;

  @OneToOne(() => Account, (account) => account.membership)
  account: Account;

  @ManyToOne(() => Welfare, (welfare) => welfare.members)
  welfare: Welfare;

  @OneToMany(
    () => MembershipContribution,
    (membership_contributions) => membership_contributions.from_member,
  )
  membership_contributions: MembershipContribution[];

  @OneToMany(
    () => MonthlyContribution,
    (monthly_contributions) => monthly_contributions.from_member,
  )
  monthly_contributions: MonthlyContribution[];

  @OneToMany(
    () => MonthlyContribution,
    (bereaved_member_contributions) =>
      bereaved_member_contributions.from_member,
  )
  bereaved_member_contributions: BereavedMemberContribution[];

  @OneToMany(
    () => MonthlyContribution,
    (deceased_member_contributions) =>
      deceased_member_contributions.from_member,
  )
  deceased_member_contributions: DeceasedMemberContribution[];

  @OneToMany(
    () => MembershipReactivationContribution,
    (membership_reactivation_contributions) =>
      membership_reactivation_contributions.from_member,
  )
  membership_reactivation_contributions: MembershipReactivationContribution[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
