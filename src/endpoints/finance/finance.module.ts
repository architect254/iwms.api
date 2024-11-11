import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Account, Expenditure } from './entities';
import { Member } from '../members/entities';
import { BankAccount, PettyCashAccount } from './entities/account.entity';
import {
  ExternalFundsTransferExpenditure,
  InternalFundsTransferExpenditure,
} from './entities/expenditure.entity';
import { Welfare } from '../welfares/welfare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Welfare,
      Account,
      BankAccount,
      PettyCashAccount,
      Expenditure,
      InternalFundsTransferExpenditure,
      ExternalFundsTransferExpenditure,
      Member,
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService, TypeOrmModule],
})
export class FinanceModule {}
