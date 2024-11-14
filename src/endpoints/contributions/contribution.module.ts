import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';
import {
  BereavedMemberContribution,
  Contribution,
  DeceasedMemberContribution,
  MembershipContribution,
  MembershipReactivationContribution,
  MonthlyContribution,
} from './contribution.entity';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contribution,
      MembershipContribution,
      MonthlyContribution,
      BereavedMemberContribution,
      DeceasedMemberContribution,
      MembershipReactivationContribution,
    ]),
    MembersModule,
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService, TypeOrmModule, MembersModule],
})
export class ContributionModule {}
