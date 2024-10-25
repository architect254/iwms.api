import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import { Contribution } from './contribution.entity';
import { UserMembershipModule } from '../account/user-membership.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution]),
    UserMembershipModule,
    TransactionModule,
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService, TypeOrmModule],
})
export class ContributionModule {}
