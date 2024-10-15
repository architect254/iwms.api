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
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from './get-user.decorator';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SearchQueryDto } from './user.dto';
import { User } from './entities/user.entity';
import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() payload: CreateUserDto, @GetUser() initiator: User) {
    return await this.userService.create(payload);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.read(id);
  }

  @Get()
  async getUsers(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    console.log('params', queryParams, paginationRequest);
    return await this.userService.readMany(page, take, queryParams);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
    @GetUser() initiator: User,
  ) {
    return await this.userService.update(id, payload);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.drop(id);
  }
}
