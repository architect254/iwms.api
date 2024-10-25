import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
} from 'typeorm';

import { Exclude } from 'class-transformer';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Membership {
  Admin = 'Admin',
  Active = 'Active',
  Bereaved = 'Bereaved',
  Deceased = 'Deceased',
  Deactivated = 'Deactivated',
}

@Entity('user_memberships')
@TableInheritance({
  column: { type: 'enum', enum: Membership, name: 'membership' },
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Membership })
  membership: Membership;

  @Column({ nullable: false })
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

  @Column({ nullable: true })
  profile_image?: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
