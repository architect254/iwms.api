import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { Account } from './account.entity';

export enum ExpenditureType {
  InternalFundsTransfer = 'Internal Funds Transfer',
  ExternalFundsTransfer = 'External Funds Transfer',
}

@Entity('expenditures')
@TableInheritance({
  column: { type: 'enum', enum: ExpenditureType, name: 'type' },
})
export abstract class Expenditure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ExpenditureType,
  })
  type: ExpenditureType;

  @ManyToOne(() => Account, (from) => from.expenditures)
  from: Account;

  @Column({ type: 'money' })
  amount: number;

  @Column()
  for: string;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}

@ChildEntity(ExpenditureType.InternalFundsTransfer)
export class InternalFundsTransferExpenditure extends Expenditure {
  @ManyToOne(() => Account, (from) => from.expenditures)
  to: Account;
}

@ChildEntity(ExpenditureType.ExternalFundsTransfer)
export class ExternalFundsTransferExpenditure extends Expenditure {
  @Column()
  to: string;
}
