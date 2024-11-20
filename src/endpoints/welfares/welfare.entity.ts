import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { DeactivatedMember, DeceasedMember, Member } from '../members/entities';
import { BereavedMember } from '../members/entities';
import { Account } from '../finance/entities';
import { Config } from '../config/entities';

@Entity('welfares')
export class Welfare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @ManyToOne(() => Config, (config) => config.welfare)
  config: Config;

  @Column({ nullable: true })
  logo_url?: string;

  @OneToOne(() => Member, (chairperson) => chairperson.welfare, {
    cascade: true,
  })
  @JoinColumn()
  chairperson: Member;

  @OneToOne(() => Member, (treasurer) => treasurer.welfare, { cascade: true })
  @JoinColumn()
  treasurer: Member;

  @OneToOne(() => Member, (secretary) => secretary.welfare, { cascade: true })
  @JoinColumn()
  secretary: Member;

  @OneToMany(
    () => Member || BereavedMember || DeceasedMember || DeactivatedMember,
    (members) => members.welfare,
    { cascade: true },
  )
  members: (Member | BereavedMember | DeceasedMember | DeactivatedMember)[];

  @OneToMany(() => Account, (accounts) => accounts.welfare)
  accounts: Account[];

  @Column({ default: 0 })
  membershipContributionAmount: number;

  @Column({ default: 0 })
  monthlyContributionAmount: number;

  @Column({ default: 0 })
  bereavedMemberContributionAmount: number;

  @Column({ default: 0 })
  deceasedMemberContributionAmount: number;

  @Column({  default: 0 })
  totalContributionsAmount: number;

  @Column({  default: 0 })
  totalExpendituresAmount: number;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
