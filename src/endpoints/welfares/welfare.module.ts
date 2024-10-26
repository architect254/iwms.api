import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import {
  Member,
  BereavedMember,
  Child,
  DeactivatedMember,
  DeceasedMember,
  Spouse,
} from '../users/entities';
import { Welfare } from './welfare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
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
