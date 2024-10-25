import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ActiveMember,
  BereavedMember,
  DeactivatedMember,
  DeceasedMember,
} from '../account/entities';

@Entity('welfares')
export class Welfare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  logo_url?: string;

  @OneToMany(
    () => ActiveMember || BereavedMember || DeceasedMember || DeactivatedMember,
    (members) => members.welfare,
  )
  members: (
    | ActiveMember
    | BereavedMember
    | DeceasedMember
    | DeactivatedMember
  )[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
