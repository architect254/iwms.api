import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  TableInheritance,
  ChildEntity,
  ManyToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Child } from './child.entity';
import { Spouse } from './spouse.entity';
import { Contribution } from 'src/endpoints/contribution/contribution.entity';
import { Welfare } from 'src/endpoints/welfare/welfare.entity';

export enum State {
  Active = 'Active',
  InActive = 'InActive',
}

export enum AccountType {
  Admin = 'Admin',
  Client = 'Client',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum Role {
  ChairPerson = 'Chair-Person',
  Treasurer = 'Treasurer',
  Secretary = 'Secretary',
  Member = 'Member',
}

export enum Status {
  Normal = 'Normal',
  Bereaved = 'Bereaved',
  Deceased = 'Deceased',
  Deactivated = 'Deactivated',
}

@Entity('user_accounts')
@TableInheritance({
  column: { type: 'enum', enum: AccountType, name: 'type' },
})
export abstract class UserAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @Column({
    type: 'enum',
    enum: State,
    default: State[State.Active],
  })
  state: State;

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
}

@ChildEntity(AccountType.Client)
export class ClientUserAccount extends UserAccount {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role[Role.Member],
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status[Status.Normal],
  })
  status: Status;

  @ManyToOne(() => Welfare, (welfare) => welfare.members)
  welfare: Welfare;

  @OneToMany(() => Contribution, (from) => from.from)
  from: Contribution[];

  @OneToMany(() => Contribution, (to) => to.to)
  to: Contribution[];

  @OneToOne(() => Spouse, (spouse) => spouse.spouse)
  @JoinColumn()
  spouse: Spouse;

  @OneToMany(() => Child, (children) => children.parent)
  children: Child[];
}

@ChildEntity(AccountType.Admin)
export class AdminUserAccount extends UserAccount {
  @Column({ unique: true })
  email: string;
}
