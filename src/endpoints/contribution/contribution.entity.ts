import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  TableInheritance,
  ChildEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { ClientUserAccount } from '../account/entities/user_account.entity';

export enum ContributionType {
  Membership = 'Membership',
  Monthly = 'Monthly',
  BereavedMember = 'Bereaved Member',
  DeceasedMember = 'Deceased Member',
  MembershipReActivation = 'Membership Re-Activation',
}

@Entity('contributions')
@TableInheritance({
  column: { type: 'enum', enum: ContributionType, name: 'type' },
})
export abstract class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContributionType,
  })
  type: ContributionType;

  @OneToOne(() => Transaction, (transaction) => transaction.id)
  transaction: Transaction;

  @ManyToOne(() => ClientUserAccount, (from) => from.from)
  from: ClientUserAccount;

  @ManyToOne(() => ClientUserAccount, (to) => to.to)
  to: ClientUserAccount;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}

@ChildEntity(ContributionType.Membership)
export class MembershipContribution extends Contribution {
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.Monthly)
export class MonthlyContribution extends Contribution {
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.BereavedMember)
export class BereavedMemberContribution extends Contribution {
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.DeceasedMember)
export class DeceasedMemberContribution extends Contribution {
  constructor() {
    super();
  }
}

@ChildEntity(ContributionType.MembershipReActivation)
export class MembershipReactivationContribution extends Contribution {
  constructor() {
    super();
  }
}
