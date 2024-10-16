import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
