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
  BereavedMemberDto,
  MemberDto,
  SearchQueryDto,
  UpdateToBereavedMemberDto,
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

  @Get('welfare/:id')
  async getManyByWelfare(
    @Param('id') id,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.membersService.readManyByWelfareId(id, page, take);
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

  @Put(':id/is-bereaved')
  @Header('content-type', 'application/json')
  async updateToBereaved(
    @Param('id') id: string,
    // @Req() req: Request,
    @Body() payload: UpdateToBereavedMemberDto,
    @GetUser() initiator: User,
  ) {
    console.log('update to bereaved 0', id);
    console.log('update to bereaved 1', payload);
    return await this.membersService.updateToBereaved(id, payload);
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
