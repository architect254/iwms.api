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

import { GetAccount } from '../account/get-account.decorator';
import { Account } from '../account/entities/account.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('welfares')
export class WelfareController {
  constructor(private welfareService: WelfareService) {}

  @Post()
  async createWelfare(@Body() payload: WelfareDto, @GetAccount() initiator: Account) {
    return await this.welfareService.create(payload);
  }

  @Get('/:id')
  async getWelfare(@Param('id') id) {
    return await this.welfareService.read(id);
  }

  @Get()
  async getWelfares(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.welfareService.readAll(page, take);
  }

  @Put('/:id')
  async updateWelfare(
    @Param('id') id,
    @Body() payload: WelfareDto,
    @GetAccount() initiator: Account,
  ) {
    return await this.welfareService.update(id, payload);
  }

  @Delete('/:id')
  async deleteWelfare(@Param('id') id) {
    await this.welfareService.drop(id);
  }
}
