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
import { Member } from 'src/endpoints/member/member.entity';

export enum State {
  Active = 'Active',
  InActive = 'InActive',
}

export enum Class {
  Admin = 'Admin',
  Client = 'Client',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender[Gender.Male],
  })
  gender: Gender;

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
    enum: State,
    default: State[State.InActive],
  })
  state: State;

  @Column({
    type: 'enum',
    enum: Class,
    default: Class[Class.Client],
    nullable: false,
  })
  class: Class;

  @Column({ nullable: true })
  profile_image?: string;

  @OneToOne(() => Member)
  @JoinColumn()
  membership: Member;

  @OneToOne(() => Spouse, (spouse) => spouse.spouse)
  @JoinColumn()
  spouse: Spouse;

  @OneToMany(() => Child, (children) => children.parent)
  children: Child[];

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Exclude()
  @Column({ nullable: false })
  salt: string;

  constructor() {}
}
