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

import { GetUser } from '../users/get-user.decorator';
import { TransactionService } from './transaction.service';
import { SearchQueryDto, TransactionDto } from './transaction.dto';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/dtos/pagination-request.dto';
import { User } from '../users/entities';

// @UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() payload: TransactionDto,
    @GetUser() initiator: User,
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
    @GetUser() initiator: User,
  ) {
    return await this.transactionService.update(id, payload);
  }

  @Delete('/:id')
  async deleteTransaction(@Param('id') id) {
    await this.transactionService.drop(id);
  }
}
