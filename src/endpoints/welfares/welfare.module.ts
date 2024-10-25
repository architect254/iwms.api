import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import {
  ActiveMember,
  BereavedMember,
  Child,
  DeactivatedMember,
  DeceasedMember,
  Spouse,
} from '../account/entities';
import { Welfare } from './welfare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActiveMember,
      BereavedMember,
      DeceasedMember,
      DeactivatedMember,
      Spouse,
      Child,
      Welfare,
    ]),
  ],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [WelfareService, TypeOrmModule],
})
export class WelfareModule {}
