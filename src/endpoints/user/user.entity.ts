import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { AbstractEntity } from '../../core/models/base-entity';
import { Group } from '../group/group.entity';

export enum UserRole {
  SITE_ADMIN = `Site Admin`,
  CLIENT = 'Client',
}

@Entity('users')
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  id_number: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ nullable: true })
  profile_image?: string; 

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn()
  group: Group;

  @Column({ nullable: true })
  group_id?: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;
}
