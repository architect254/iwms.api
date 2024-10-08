import { Entity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Group } from '../group/group.entity';
import { AbstractEntity } from '../../core/models/base-entity';
import { User } from '../user/entities/user.entity';

export enum MembershipStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('memberships')
export class Membership extends AbstractEntity {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  member: User;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.INACTIVE,
  })
  status: MembershipStatus;

  @ManyToOne(() => Group, (group) => group.memberships, { nullable: false })
  @JoinColumn()
  group: Group;

  @Column({ nullable: false })
  groupId: number;
  constructor() {
    super();
  }
}
