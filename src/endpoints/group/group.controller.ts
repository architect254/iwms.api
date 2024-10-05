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

import { GroupService } from './group.service';
import { GroupDto } from './group.dto';

import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async createGroup(
    @Body() payload: GroupDto,
    @GetUser() initiator: User,
  ) {
    return await this.groupService.create(payload, initiator);
  }

  @Get('/:id')
  async getGroup(@Param('id') id) {
    return await this.groupService.read(id);
  }

  @Get()
  async getAllGroups(
    @Query('page') page: number,
    @Query('take') take: number,
  ) {
    return await this.groupService.readAll(page, take);
  }

  @Put('/:id')
  async updateGroup(
    @Param('id') id,
    @Body() payload: GroupDto,
    @GetUser() initiator: User,
  ) {
    return await this.groupService.update(id, payload, initiator);
  }

  @Delete('/:id')
  async deleteGroup(@Param('id') id) {
    await this.groupService.drop(id);
  }
}
