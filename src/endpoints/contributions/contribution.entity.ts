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
import { Transaction } from '../transactions/transaction.entity';
import {
  Member,
  BereavedMember,
  DeceasedMember,
} from '../users/entities';

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

  @ManyToOne(() => Member || BereavedMember, (from) => from.from)
  from: Member | BereavedMember;

  @ManyToOne(() => BereavedMember || DeceasedMember, (to) => to.to, {
    nullable: true,
  })
  to?: BereavedMember | DeceasedMember;

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
