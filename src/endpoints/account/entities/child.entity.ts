import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from './account.entity';

@Entity('children')
export class Child {
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

  @Column()
  birth_date: Date;

  @ManyToOne(() => Account, (parent) => parent.children)
  parent: Account;
  constructor() {}
}
