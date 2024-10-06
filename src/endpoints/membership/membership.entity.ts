import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Group } from '../group/group.entity';
import { AbstractEntity } from '../../core/models/base-entity';

export enum MembershipStatus {
  ACTIVE = 'Active',
  Inactive = 'Inactive',
}

@Entity('memberships')
export class Membership extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.Inactive,
  })
  status: MembershipStatus;

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn()
  group: Group;

  @Column({ nullable: false })
  group_id: string;
  constructor() {
    super();
  }
}
