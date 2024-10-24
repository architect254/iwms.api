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

import { GetUserAccount } from './get-user_account.decorator';
import { UserAccountService } from './user_account.service';
import { CreateUserAccountDto, SearchQueryDto } from './user_account.dto';
import { UserAccount } from './entities/user_account.entity';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('user-accounts')
export class UserAccountController {
  constructor(private userAccountService: UserAccountService) {}

  @Post()
  async create(
    @Body() payload: CreateUserAccountDto,
    @GetUserAccount() initiator: UserAccount,
  ) {
    return await this.userAccountService.create(payload);
  }

  @Get('admins')
  async getManyAdmins(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.userAccountService.readManyAdminUserAccounts(
      page,
      take,
      queryParams,
    );
  }

  @Get('clients')
  async getManyClients(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.userAccountService.readManyClientUserAccounts(
      page,
      take,
      queryParams,
    );
  }

  @Get('all')
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.userAccountService.readMany(page, take, queryParams);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.userAccountService.read(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<CreateUserAccountDto>,
    @GetUserAccount() initiator: UserAccount,
  ) {
    return await this.userAccountService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.userAccountService.drop(id);
  }
}
