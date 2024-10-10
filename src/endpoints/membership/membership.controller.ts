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

import { MembershipService } from './membership.service';
import { MembershipDto } from './membership.dto';
import { Membership } from './membership.entity';

import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/entities/user.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('memberships')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Post()
  async createMembership(
    @Body() payload: MembershipDto,
    @GetUser() initiator: User,
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
    @Body() payload: MembershipDto,
    @GetUser() initiator: User,
  ) {
    return await this.membershipService.update(id, payload);
  }

  @Delete('/:id')
  async deleteMembership(@Param('id') id: number) {
    await this.membershipService.drop(id);
  }
}
