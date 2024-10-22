import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

export enum TransactionType {
  Internal = 'Internal',
  External = 'External',
}
export enum TransactionStatus {
  Committed = 'Committed',
  RolledBack = 'Rolled Back',
}
@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  id?: string;

  @Column()
  for: string;

  @Column({ nullable: false, type: 'money' })
  amount: number;

  @Column({ nullable: false })
  from_account: string;

  @Column({ nullable: false })
  to_account: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType[TransactionType.Internal],
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus[TransactionStatus.Committed],
  })
  status: TransactionStatus;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;

  constructor() {}
}
