import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '../group/group.entity';
import { User } from '../user/entities/user.entity';

export enum MembershipStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id?: number;
  
  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.INACTIVE,
  })
  status: MembershipStatus;

  @OneToOne(() => User, (member) => member.membership)
  member: User;

  @ManyToOne(() => Group, (group) => group.memberships, { eager: true })
  group: Group;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
