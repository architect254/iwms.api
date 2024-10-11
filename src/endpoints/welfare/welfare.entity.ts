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

@Entity('welfares')
export class Welfare {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  logo_url?: string;

  @OneToMany(() => Membership, (memberships) => memberships.welfare)
  memberships: Membership[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
