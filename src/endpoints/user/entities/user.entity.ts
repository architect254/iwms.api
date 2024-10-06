import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Child } from './child.entity';
import { Spouse } from './spouse.entity';
import { Membership } from 'src/endpoints/membership/membership.entity';

export enum UserRole {
  SITE_ADMIN = `Site Admin`,
  CLIENT = 'Client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  id_number: string;

  @Column()
  birth_date: Date;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ nullable: true })
  profile_image?: string;

  @OneToOne(() => Membership, { nullable: true })
  @JoinColumn()
  membership: Membership;

  @Column({ nullable: true })
  membership_id: string;

  @OneToOne(() => Spouse, (spouse) => spouse.spouse, { nullable: true })
  @JoinColumn()
  spouse: Spouse;

  @Column({ nullable: true })
  spouse_id: string;

  @OneToMany(() => Child, (child) => child.parent)
  @JoinColumn()
  children: Child[];

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  constructor() {}
}
