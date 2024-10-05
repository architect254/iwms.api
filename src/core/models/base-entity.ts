import {
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { User } from '../../endpoints/user/user.entity';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  creator: User;

  @Column({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  updator: User;

  @Column({ nullable: true })
  updator_id: string;
}

