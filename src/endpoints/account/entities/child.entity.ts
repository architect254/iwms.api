import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ClientUserAccount } from './user_account.entity';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender[Gender.Male],
  })
  gender: Gender;

  @Column()
  birth_date: Date;

  @ManyToOne(() => ClientUserAccount, (parent) => parent.children)
  parent: ClientUserAccount;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
  constructor() {}
}
