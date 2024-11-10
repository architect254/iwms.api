import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import { Welfare } from './welfare.entity';
import { MembersModule } from '../members/members.module';
import { ContributionModule } from '../contributions/contribution.module';

@Module({
  imports: [TypeOrmModule.forFeature([Welfare]), ContributionModule],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [WelfareService, TypeOrmModule, ContributionModule],
})
export class WelfareModule {}
