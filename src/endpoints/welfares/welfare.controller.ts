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
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { User } from 'src/core/models/entities/user.entity';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/dtos/pagination-request.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('welfares')
export class WelfareController {
  constructor(private welfareService: WelfareService) {}

  @Post()
  async create(@Body() payload: WelfareDto, @GetUser() initiator: User) {
    return await this.welfareService.create(payload);
  }

  @Get()
  async getMany(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.welfareService.readMany(page, take);
  }

  @Get('search')
  async search(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query('name')
    name: string,
  ) {
    const { page, take } = paginationRequest;
    return await this.welfareService.search(page, take, name);
  }

  @Get('/:id')
  async get(@Param('id') id) {
    return await this.welfareService.read(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id,
    @Body() payload: WelfareDto,
    @GetUser() initiator: User,
  ) {
    return await this.welfareService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.welfareService.drop(id);
  }
}
