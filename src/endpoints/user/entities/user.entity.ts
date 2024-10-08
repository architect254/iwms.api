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
  WELFARE_MANAGER = 'Welfare Manager',
  WELFARE_ACCOUNTANT = 'Welfare Accountant',
  WELFARE_SECRETARY = 'Welfare Secretary',
  WELFARE_CLIENT_MEMBER = 'Welfare Client Member',
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
    default: UserRole.WELFARE_CLIENT_MEMBER,
    nullable: false,
  })
  role: UserRole;

  @Column({ nullable: true })
  profile_image?: string;

  @OneToOne(() => Membership, { nullable: true })
  membership: Membership;

  @Column({ nullable: true })
  membership_id: number;

  @OneToOne(() => Spouse, (spouse) => spouse.spouse, { nullable: true })
  spouse: Spouse;

  @Column({ nullable: true })
  spouseId: number;

  @OneToMany(() => Child, (child) => child.parent, { nullable: true })
  children: Child[];

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Exclude()
  @Column({ nullable: false })
  salt: string;

  constructor() {}
}
