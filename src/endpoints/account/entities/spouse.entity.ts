import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('spouses')
export class Spouse {
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

  @Column({ unique: true })
  id_number: string;

  @Column()
  birth_date: Date;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Account, (account) => account.spouse)
  spouse: Spouse;

  constructor() {}
}
