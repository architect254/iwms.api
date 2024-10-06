import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { MembershipService } from '../membership/membership.service';
import { GroupService } from '../group/group.service';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Spouse, Child])],
  controllers: [UserController],
  providers: [UserService, MembershipService, GroupService],
})
export class UserModule {}
