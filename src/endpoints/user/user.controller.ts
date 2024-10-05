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
  Options,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from './get-user.decorator';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from './user.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() payload: UserDto, @GetUser() initiator: User) {
    return await this.userService.create(payload, initiator);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.read(id);
  }
  
  @Get()
  async getUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('take', ParseIntPipe) take: number = 10,
  ) {
    return await this.userService.readAll(page, take);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() payload: UserDto,
    @GetUser() initiator: User,
  ) {
    return await this.userService.update(id, payload, initiator);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.drop(id);
  }
}