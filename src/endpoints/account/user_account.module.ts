import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAccountController } from './user_account.controller';
import { UserAccountService } from './user_account.service';

import {
  AdminUserAccount,
  ClientUserAccount,
  UserAccount,
} from './entities/user_account.entity';
import { Spouse } from './entities/spouse.entity';
import { Child } from './entities/child.entity';

import { WelfareModule } from '../welfare/welfare.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAccount,
      AdminUserAccount,
      ClientUserAccount,
      Spouse,
      Child,
    ]),
    WelfareModule,
  ],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService, TypeOrmModule],
})
export class UserAccountModule {}
