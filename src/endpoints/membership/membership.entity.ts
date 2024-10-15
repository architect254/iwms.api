import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Welfare } from '../welfare/welfare.entity';
import { User } from '../user/entities/user.entity';

export enum MembershipStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}
export enum MembershipRole {
  WELFARE_MANAGER = 'Welfare Manager',
  WELFARE_ACCOUNTANT = 'Welfare Accountant',
  WELFARE_SECRETARY = 'Welfare Secretary',
  WELFARE_MEMBER = 'Welfare Member',
}

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus[MembershipStatus.INACTIVE],
  })
  status: MembershipStatus;

  @Column({
    type: 'enum',
    enum: MembershipRole,
    default: MembershipRole[MembershipRole.WELFARE_MEMBER],
  })
  membership_role: MembershipRole;

  @OneToOne(() => User, (member) => member.membership)
  member: User;

  @ManyToOne(() => Welfare, (welfare) => welfare.memberships)
  welfare: Welfare;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
