import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { DeactivatedMember, DeceasedMember, Member } from '../users/entities';
import { BereavedMember } from '../members/entities';

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

  @Column()
  hostname: string;

  @Column({ nullable: true })
  logo_url?: string;

  @OneToOne(() => Member, (chairperson) => chairperson.id)
  chairperson: Member;

  @OneToOne(() => Member, (treasurer) => treasurer.id)
  treasurer: Member;

  @OneToOne(() => Member, (secretary) => secretary.id)
  secretary: Member;

  @OneToMany(
    () => Member || BereavedMember || DeceasedMember || DeactivatedMember,
  (members) => members.welfare,
  )
  members: (Member | BereavedMember | DeceasedMember | DeactivatedMember)[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
