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

import { GetUser } from '../users/get-user.decorator';
import { ContributionService } from './contribution.service';
import { SearchQueryDto, ContributionDto } from './contribution.dto';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/dtos/pagination-request.dto';
import { User } from '../users/entities';

// @UseGuards(AuthGuard('jwt'))
@Controller('contributions')
export class ContributionController {
  constructor(private contributionService: ContributionService) {}

  @Post()
  async create(@Body() payload: ContributionDto, @GetUser() initiator: User) {
    return await this.contributionService.create(payload);
  }

  @Get('/:id')
  async get(@Param('id') id) {
    return await this.contributionService.read(id);
  }

  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query()
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.contributionService.readMany(page, take, queryParams);
  }

  @Put('/:id')
  async update(
    @Param('id') id,
    @Body() payload: ContributionDto,
    @GetUser() initiator: User,
  ) {
    return await this.contributionService.update(id, payload);
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    await this.contributionService.drop(id);
  }
}
