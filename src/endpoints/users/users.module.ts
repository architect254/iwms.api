import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserMembershipController } from './user-membership.controller';
import { UserMembershipService } from './user-membership.service';

import { WelfareModule } from '../welfare/welfare.module';

import { Admin, User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin]), WelfareModule],
  controllers: [UserMembershipController],
  providers: [UserMembershipService],
  exports: [UserMembershipService, TypeOrmModule],
})
export class UserMembershipModule {}
