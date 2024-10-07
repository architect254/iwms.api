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

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true })
  id_number: string;

  @Column({ nullable: false })
  birth_date: Date;

  @Column({ unique: true, nullable: false })
  phone_number: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
    nullable: false,
  })
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

  @OneToMany(() => Child, (child) => child.parent, { nullable: true })
  @JoinColumn()
  children: Child[];

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Exclude()
  @Column({ nullable: false })
  salt: string;

  constructor() {}
}
