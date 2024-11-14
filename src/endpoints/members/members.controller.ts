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
  ValidationPipe,
  Req,
  Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../../core/decorators/get-user.decorator';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/dtos/pagination-request.dto';
import {
  IsBereavedMemberDto,
  IsDeactivatedMemberDto,
  IsDeceasedMemberDto,
  MemberDto,
  SearchQueryDto,
} from './dtos';
import { MembersService } from './members.service';
import { User } from 'src/core/models/entities/user.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Post()
  async create(@Body() payload: MemberDto, @GetUser() initiator: User) {
    return await this.membersService.create(payload);
  }

  @Get('search')
  async search(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query('name')
    name: string,
  ) {
    const { page, take } = paginationRequest;
    if (name.includes('(')) {
      name = name.split('(')[0];
    }
    name = name.trim();
    return await this.membersService.search(page, take, name);
  }

  @Get('by-welfare/:id')
  async getManyByWelfare(
    @Param('id') id,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.membersService.readManyByWelfareId(
      id,
      page,
      take,
      queryParams,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.membersService.read(id);
  }

  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.membersService.readMany(page, take, queryParams);
  }

  @Put(':id/is-deceased')
  @Header('content-type', 'application/json')
  async isDeceased(
    @Param('id') id: string,
    @Body() payload: IsDeceasedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.membersService.isDeceased(id, payload);
  }

  @Put(':id/is-bereaved')
  @Header('content-type', 'application/json')
  async isBereaved(
    @Param('id') id: string,
    @Body() payload: IsBereavedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.membersService.isBereaved(id, payload);
  }

  @Put(':id/is-deactivated')
  @Header('content-type', 'application/json')
  async IsDeactivated(
    @Param('id') id: string,
    @Body() payload: IsDeactivatedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.membersService.isDeactivated(id, payload);
  }

  @Put(':id/activate')
  async IsActivated(@Param('id') id: string, @GetUser() initiator: User) {
    return await this.membersService.activate(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<MemberDto>,
    @GetUser() initiator: User,
  ) {
    return await this.membersService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.membersService.drop(id);
  }
}
