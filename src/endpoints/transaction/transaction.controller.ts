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

import { GetUserAccount } from '../account/get-user_account.decorator';
import { AccountType, UserAccount } from '../account/entities/user_account.entity';
import { TransactionService } from './transaction.service';
import { SearchQueryDto, TransactionDto } from './transaction.dto';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() payload: TransactionDto,
    @GetUserAccount() initiator: UserAccount,
  ) {
    return await this.transactionService.create(payload);
  }

  @Get('/:id')
  async getTransaction(@Param('id') id) {
    return await this.transactionService.read(id);
  }

  @Get()
  async getTransactions(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.transactionService.readAll(page, take, queryParams);
  }

  @Put('/:id')
  async updateTransaction(
    @Param('id') id,
    @Body() payload: TransactionDto,
    @GetUserAccount() initiator: UserAccount,
  ) {
    return await this.transactionService.update(id, payload);
  }

  @Delete('/:id')
  async deleteTransaction(@Param('id') id) {
    await this.transactionService.drop(id);
  }
}
