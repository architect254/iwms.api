import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetAccount } from './get-account.decorator';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  SearchQueryDto,
} from './account.dto';
import { Account } from './entities/account.entity';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() payload: CreateAccountDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.accountService.create(payload);
  }

  @Get('/:id')
  async getAccountById(@Param('id') id: number) {
    return await this.accountService.read(id);
  }

  @Get()
  async getAccounts(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    console.log('params', queryParams, paginationRequest);
    return await this.accountService.readMany(page, take, queryParams);
  }

  @Put('/:id')
  async updateAccount(
    @Param('id') id: number,
    @Body() payload: UpdateAccountDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.accountService.update(id, payload);
  }

  @Delete('/:id')
  async deleteAccount(@Param('id') id: number) {
    await this.accountService.drop(id);
  }
}
