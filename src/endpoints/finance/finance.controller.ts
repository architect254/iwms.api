import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FinanceService } from './finance.service';
import { SearchQueryDto } from './finance.dto';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/dtos/pagination-request.dto';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { User } from 'src/core/models/entities/user.entity';
import { UpdateContributionAmountDto } from './dtos';
import {
  ExternalFundsTransferExpenditureDto,
  InternalFundsTransferExpenditureDto,
} from './dtos/expenditure.dto';
import { BankAccountDto, PettyCashAccountDto } from './dtos/account.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('finances')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Post('accounts')
  async createAccount(
    @Body() payload: BankAccountDto | PettyCashAccountDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.createAccount(payload);
  }

  @Get('accounts')
  async getManyAccounts(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.financeService.readManyAccounts(page, take, queryParams);
  }

  @Get('accounts/by-welfare/:id')
  async getManyAccountsByWelfare(
    @Param('id') id,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
    @GetUser() initiator: User,
  ) {
    const { page, take } = paginationRequest;
    return await this.financeService.getManyAccountsByWelfare(
      id,
      page,
      take,
      queryParams,
    );
  }

  @Get('accounts/:id')
  async getAccount(@Param('id') id: string) {
    return await this.financeService.readAccount(id);
  }

  @Post('expenditures')
  async createExpenditure(
    @Body()
    payload:
      | InternalFundsTransferExpenditureDto
      | ExternalFundsTransferExpenditureDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.createExpenditure(payload);
  }

  @Get('expenditures/by-welfare/:id')
  async getManyExpendituresByWelfare(
    @Param('id') id,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
    @GetUser() initiator: User,
  ) {
    const { page, take } = paginationRequest;
    return await this.financeService.getManyExpendituresByWelfare(
      id,
      page,
      take,
      queryParams,
    );
  }

  @Get('expenditures/:id')
  async getExpenditure(@Param('id') id: string) {
    return await this.financeService.readExpenditure(id);
  }

  @Get('expenditures')
  async getManyExpenditures(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.financeService.readManyExpenditures(
      page,
      take,
      queryParams,
    );
  }

  @Put('welfare/:id/membership-contrib-amnt')
  async updateMembershipContributionAmount(
    @Param('id') id: string,
    @Body() payload: UpdateContributionAmountDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.updateMembershipContributionAmount(
      id,
      payload,
    );
  }

  @Put('welfare/:id/monthly-contrib-amnt')
  async updateMonthlyContributionAmount(
    @Param('id') id: string,
    @Body() payload: UpdateContributionAmountDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.updateMonthlyContributionAmount(
      id,
      payload,
    );
  }

  @Put('welfare/:id/bereavement-contrib-amnt')
  async updateBereavementContributionAmount(
    @Param('id') id: string,
    @Body() payload: UpdateContributionAmountDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.updateBereavementContributionAmount(
      id,
      payload,
    );
  }

  @Put('welfare/:id/deceased-contrib-amnt')
  async updateDeceasedContributionAmount(
    @Param('id') id: string,
    @Body() payload: UpdateContributionAmountDto,
    @GetUser() initiator: User,
  ) {
    return await this.financeService.updateDeceasedContributionAmount(
      id,
      payload,
    );
  }
}
