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

import {
  PaginationRequestDto,
  PaginationTransformPipe,
} from 'src/core/models/dtos/pagination-request.dto';
import { AdminsService } from './admins.service';
import { AdminDto, SearchQueryDto } from './dtos/admin.dto';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { User } from 'src/core/models/entities/user.entity';


// @UseGuards(AuthGuard('jwt'))
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post('')
  async createAdmin(@Body() payload: AdminDto, @GetUser() initiator: User) {
    return await this.adminsService.create(payload);
  }


  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.adminsService.readMany(
      page,
      take,
      queryParams,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.adminsService.read(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: Partial<AdminDto>,
    @GetUser() initiator: User,
  ) {
    return await this.adminsService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.adminsService.drop(id);
  }
}
