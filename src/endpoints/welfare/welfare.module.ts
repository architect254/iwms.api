import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WelfareController } from './welfare.controller';
import { WelfareService } from './welfare.service';
import { Welfare } from './welfare.entity';
import { ClientUserAccount } from '../account/entities/user_account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Welfare, ClientUserAccount])],
  controllers: [WelfareController],
  providers: [WelfareService],
  exports: [WelfareService, TypeOrmModule],
})
export class WelfareModule {}
