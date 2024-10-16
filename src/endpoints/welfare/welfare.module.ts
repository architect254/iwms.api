import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import { Welfare } from './welfare.entity';
import { Member } from '../member/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Welfare, Member])],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [WelfareService, TypeOrmModule],
})
export class WelfareModule {}
