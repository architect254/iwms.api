import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Account, Expenditure } from './entities';
import { Welfare } from '../welfares/welfare.entity';
import { Member } from '../members/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Expenditure, Welfare, Member])],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService, TypeOrmModule],
})
export class FinanceModule {}
