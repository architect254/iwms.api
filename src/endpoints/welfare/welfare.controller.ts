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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WelfareService } from './welfare.service';
import { WelfareDto } from './welfare.dto';

import { GetUserAccount } from '../account/get-user_account.decorator';
import { ClientUserAccount } from '../account/entities/user_account.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('welfares')
export class WelfareController {
  constructor(private welfareService: WelfareService) {}

  @Post()
  async create(
    @Body() payload: WelfareDto,
    @GetUserAccount() initiator: ClientUserAccount,
  ) {
    return await this.welfareService.create(payload);
  }

  @Get('/:id')
  async get(@Param('id') id) {
    return await this.welfareService.read(id);
  }

  @Get()
  async getMany(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.welfareService.readMany(page, take);
  }

  @Put('/:id')
  async update(
    @Param('id') id,
    @Body() payload: WelfareDto,
    @GetUserAccount() initiator: ClientUserAccount,
  ) {
    return await this.welfareService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.welfareService.drop(id);
  }
}
