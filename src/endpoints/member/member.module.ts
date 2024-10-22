import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './member.entity';
import { Account } from '../account/entities/account.entity';
import { Spouse } from '../account/entities/spouse.entity';
import { Child } from '../account/entities/child.entity';
import { Welfare } from '../welfare/welfare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Account, Spouse, Child, Welfare]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
