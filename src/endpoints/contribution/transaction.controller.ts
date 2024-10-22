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

import { GetAccount } from '../account/get-account.decorator';
import { Account } from '../account/entities/account.entity';
import { TransactionService } from './contribution.service';
import { SearchQueryDto, TransactionDto } from './contribution.dto';
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
    @GetAccount() initiator: Account,
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
    @GetAccount() initiator: Account,
  ) {
    return await this.transactionService.update(id, payload);
  }

  @Delete('/:id')
  async deleteTransaction(@Param('id') id) {
    await this.transactionService.drop(id);
  }
}
