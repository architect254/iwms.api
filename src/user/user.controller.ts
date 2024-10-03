import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUser } from '../auth/get-user.decorator';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from './user.entity';

import { STORAGE } from '../core/config/multer.config';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImage', STORAGE))
  async createUser(
    @UploadedFile() file: any, //Express.Multer.File,
    @Body() payload: UserDto,
    @GetUser() initiator: User,
  ) {
    const user: UserDto & typeof file = {
      ...payload,
      profileImage: file.filename,
    };
    return await this.userService.create(user, initiator);
  }

  @Get('/:id')
  async getUser(@Param('id') id) {
    return await this.userService.read(id);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.userService.readAll(page, pageSize);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id,
    @Body() payload: UserDto,
    @GetUser() initiator: User,
  ) {
    return await this.userService.update(id, payload, initiator);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id) {
    await this.userService.drop(id);
  }
}
