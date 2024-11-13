import { Contribution } from 'src/endpoints/contributions/contribution.entity';
import { Welfare } from 'src/endpoints/welfares/welfare.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { Expenditure } from './expenditure.entity';

export enum AccountType {
  Bank = 'Bank',
  PettyCash = 'Petty Cash',
}

@Entity('accounts')
@TableInheritance({
  column: { type: 'enum', enum: AccountType, name: 'type' },
})
export abstract class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  base_amount: number;

  @Column({default: 0 })
  current_amount: number;

  @ManyToOne(() => Welfare, (welfare) => welfare.members, { eager: true })
  welfare: Welfare;

  @OneToMany(() => Contribution, (contributions) => contributions.account)
  contributions: Contribution[];

  @OneToMany(() => Expenditure, (expenditures) => expenditures.id)
  expenditures: Expenditure[];

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}

@ChildEntity(AccountType.Bank)
export class BankAccount extends Account {
  @Column({ unique: true })
  number: string;
}

@ChildEntity(AccountType.PettyCash)
export class PettyCashAccount extends Account {}
