import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserMembershipController } from './users.controller';
import { UserMembershipService } from './users.service';

import { WelfareModule } from '../welfares/welfare.module';

import { Admin, User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin]), WelfareModule],
  controllers: [UserMembershipController],
  providers: [UserMembershipService],
  exports: [UserMembershipService, TypeOrmModule],
})
export class UserMembershipModule {}
