import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import { Welfare } from './welfare.entity';
import { MembersModule } from '../members/members.module';
import { ContributionModule } from '../contributions/contribution.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Welfare]),
    MembersModule,
    ContributionModule,
    FinanceModule,
  ],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [
    WelfareService,
    TypeOrmModule,
    MembersModule,
    ContributionModule,
    FinanceModule,
  ],
})
export class WelfareModule {}
