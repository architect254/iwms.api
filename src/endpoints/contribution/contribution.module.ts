import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import { Contribution } from './contribution.entity';
import { Transaction } from '../transaction/transaction.entity';
import { ClientUserAccount } from '../account/entities/user_account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, ClientUserAccount, Transaction]),
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService, TypeOrmModule],
})
export class ContributionModule {}
