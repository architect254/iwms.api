import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { Member } from '.';
import { Gender } from 'src/core/models/entities/user.entity';

@Entity('spouses')
export class Spouse {
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

  @Column({ unique: true })
  id_number: string;

  @Column()
  birth_date: Date;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Member, (account) => account.spouse)
  spouse: Member;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}
