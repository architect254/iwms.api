import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Welfare } from '../welfare/welfare.entity';
import { Account } from '../account/entities/account.entity';

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

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
