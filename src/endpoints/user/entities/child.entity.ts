import { Entity, Column, JoinColumn, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';

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

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  parent: User;

  @Column({ nullable: false })
  parent_id?: number;
  constructor() {}
}
