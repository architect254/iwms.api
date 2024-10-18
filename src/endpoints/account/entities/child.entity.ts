import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from './account.entity';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

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

  @ManyToOne(() => Account, (parent) => parent.children)
  parent: Account;
  constructor() {}
}
