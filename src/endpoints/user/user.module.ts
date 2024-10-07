import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembershipModule } from '../membership/membership.module';
import { MembershipService } from '../membership/membership.service';
import { Membership } from '../membership/membership.entity';

import { GroupModule } from '../group/group.module';
import { GroupService } from '../group/group.service';
import { Group } from '../group/group.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Spouse, Child, Membership, Group]),
    GroupModule,
    MembershipModule,
  ],
  controllers: [UserController],
  providers: [UserService, MembershipService, GroupService],
  exports: [UserService, GroupModule, MembershipModule],
})
export class UserModule {}
