import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  BereavedMember,
  Child,
  DeactivatedMember,
  DeceasedMember,
  Member,
  Spouse,
} from './entities';

import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      BereavedMember,
      DeceasedMember,
      DeactivatedMember,
      Spouse,
      Child,
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService, TypeOrmModule],
})
export class MembersModule {}
