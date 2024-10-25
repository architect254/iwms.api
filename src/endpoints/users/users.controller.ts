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

import { GetUser } from './get-user.decorator';
import { UserMembershipService } from './user-membership.service';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/pagination-request.dto';

import { User } from './entities';
import {
  ActiveMemberDto,
  AdminDto,
  BereavedMemberDto,
  DeactivatedMemberDto,
  DeceasedMemberDto,
  SearchQueryDto,
  UserDto,
} from './dtos';

// @UseGuards(AuthGuard('jwt'))
@Controller('user-memberships')
export class UserMembershipController {
  constructor(private userMembershipService: UserMembershipService) {}

  @Post('admin')
  async createAdmin(@Body() payload: AdminDto, @GetUser() initiator: User) {
    return await this.userMembershipService.create(payload);
  }

  @Post('active')
  async createActiveMember(
    @Body() payload: ActiveMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.userMembershipService.create(payload);
  }

  @Post('bereaved')
  async createBereavedMember(
    @Body() payload: BereavedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.userMembershipService.create(payload);
  }

  @Post('deceased')
  async createDeceasedMember(
    @Body() payload: DeceasedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.userMembershipService.create(payload);
  }

  @Post('deactivated')
  async create(
    @Body() payload: DeactivatedMemberDto,
    @GetUser() initiator: User,
  ) {
    return await this.userMembershipService.create(payload);
  }
  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    const { membership } = queryParams;
    return await this.userMembershipService.readMany(
      membership,
      page,
      take,
      queryParams,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.userMembershipService.read(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<UserDto>,
    @GetUser() initiator: User,
  ) {
    return await this.userMembershipService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userMembershipService.drop(id);
  }
}
