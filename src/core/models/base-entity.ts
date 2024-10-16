import {
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Account } from '../../endpoints/account/entities/account.entity';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn()
  creator: Account;

  @Column({ nullable: true })
  creator_id: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn()
  updator: Account;

  @Column({ nullable: true })
  updator_id: string;
  constructor() {}
}
