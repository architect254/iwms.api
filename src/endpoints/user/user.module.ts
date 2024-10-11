import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { User } from './entities/user.entity';
import { WelfareModule } from '../welfare/welfare.module';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Spouse, Child]),
    MembershipModule,
    WelfareModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
