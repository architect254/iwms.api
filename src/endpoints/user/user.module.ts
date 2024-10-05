import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';

import { Group } from '../group/group.entity';
import { GroupService } from '../group/group.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group])],
  controllers: [UserController],
  providers: [UserService, GroupService],
})
export class UserModule {}
 