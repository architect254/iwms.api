import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ActiveMember, Gender } from '..';

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

  @ManyToOne(() => ActiveMember, (parent) => parent.children)
  parent: ActiveMember;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}
