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

import { GetUser } from '../../core/decorators/get-user.decorator';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/dtos/pagination-request.dto';
import {
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
  async create(
    @Body() payload: MemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.membersService.create(payload);
  }

  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.membersService.readMany(
      page,
      take,
      queryParams,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.membersService.read(id);
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
