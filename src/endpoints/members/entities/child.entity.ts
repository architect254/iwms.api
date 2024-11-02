import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Member } from '.';
import { Gender } from 'src/core/models/entities/user.entity';

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

  @ManyToOne(() => Member, (parent) => parent.children)
  parent: Member;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}
