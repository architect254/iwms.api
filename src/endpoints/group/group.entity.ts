import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/entities/user.entity';

import { AbstractEntity } from '../../core/models/base-entity';
import { Membership } from '../membership/membership.entity';

@Entity('groups')
export class Group extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  logo_image?: string;

  @OneToMany(() => Membership, (memberships) => memberships.group, {
    nullable: true,
  })
  memberships: Membership[];

  constructor() {
    super();
  }
}
