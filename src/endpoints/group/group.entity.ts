import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Membership } from '../membership/membership.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  logo_image?: string;

  @OneToMany(() => Membership, (memberships) => memberships.group)
  memberships: Membership[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
