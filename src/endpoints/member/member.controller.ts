import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
  ParseIntPipe,
  Options,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MemberService } from './member.service';
import { MemberDto } from './member.dto';
import { Member } from './member.entity';

import { GetAccount } from '../account/get-account.decorator';
import { Account } from '../account/entities/account.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MemberController {
  constructor(private membershipService: MemberService) {}

  @Post()
  async createMembership(
    @Body() payload: MemberDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.membershipService.create(payload);
  }

  @Get('/:id')
  async getMembershipById(@Param('id') id: number) {
    return await this.membershipService.read(id);
  }

  @Get()
  async getMemberships(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 10,
  ) {
    return await this.membershipService.readAll(page, take);
  }

  @Put('/:id')
  async updateMembership(
    @Param('id') id: number,
    @Body() payload: MemberDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.membershipService.update(id, payload);
  }

  @Delete('/:id')
  async deleteMembership(@Param('id') id: number) {
    await this.membershipService.drop(id);
  }
}
