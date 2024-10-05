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
  SITE_ADMIN = `site admin`,
  CLIENT = 'client',
}

@Entity('users')
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  idNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ nullable: true })
  profileImage?: string;

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn()
  group: Group;

  @Column({ nullable: true })
  groupId?: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;
}
