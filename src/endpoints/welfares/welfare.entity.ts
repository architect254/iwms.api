import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DeactivatedMember, DeceasedMember, Member } from '../members/entities';
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

  @Column({ default: 'iwms-5vlj.onrender.com', nullable: true })
  hostname: string;

  @Column({ nullable: true })
  logo_url?: string;

  @OneToOne(() => Member, (chairperson) => chairperson.welfare)
  @JoinColumn()
  chairperson: Member;

  @OneToOne(() => Member, (treasurer) => treasurer.welfare)
  @JoinColumn()
  treasurer: Member;

  @OneToOne(() => Member, (secretary) => secretary.welfare)
  @JoinColumn()
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
