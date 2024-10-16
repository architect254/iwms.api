import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { Account } from './entities/account.entity';
import { WelfareModule } from '../welfare/welfare.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Spouse, Child]),
    MemberModule,
    WelfareModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
