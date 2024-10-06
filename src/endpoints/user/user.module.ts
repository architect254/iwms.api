import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { MembershipService } from '../membership/membership.service';
import { GroupService } from '../group/group.service';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { User } from './entities/user.entity';
import { Membership } from '../membership/membership.entity';
import { Group } from '../group/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Spouse, Child, Membership, Group])],
  controllers: [UserController],
  providers: [UserService, MembershipService, GroupService],
})
export class UserModule {}
