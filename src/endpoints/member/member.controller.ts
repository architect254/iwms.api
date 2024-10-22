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
import {
  CreateMemberDto,
  MemberDto,
  SearchQueryDto,
  UpdateMemberDto,
} from './member.dto';
import { Member } from './member.entity';

import { GetAccount } from '../account/get-account.decorator';
import { Account } from '../account/entities/account.entity';
import { take } from 'rxjs';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MemberController {
  constructor(private membershipService: MemberService) {}

  @Post()
  async createMembership(
    @Body() payload: CreateMemberDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.membershipService.create(payload);
  }

  @Get()
  async getMemberships(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;

    return await this.membershipService.readAll(page, take, queryParams);
  }

  @Get('/by-welfare-id/:welfareId')
  async getMembershipsByWelfare(
    @Param('welfareId') welfareId: number,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    console.log('welfareId', welfareId);
    return await this.membershipService.readAllByWelfareId(
      welfareId,
      page,
      take,
      queryParams,
    );
  }

  @Get('/:id')
  async getMembershipById(@Param('id') id: number) {
    return await this.membershipService.read(id);
  }

  @Put('/:id')
  async updateMembership(
    @Param('id') id: number,
    @Body() payload: UpdateMemberDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.membershipService.update(id, payload);
  }

  @Delete('/:id')
  async deleteMembership(@Param('id') id: number) {
    await this.membershipService.drop(id);
  }
}
