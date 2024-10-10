import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import { Welfare } from './welfare.entity';
import { Membership } from '../membership/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Welfare, Membership])],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [WelfareService, TypeOrmModule],
})
export class WelfareModule {}
