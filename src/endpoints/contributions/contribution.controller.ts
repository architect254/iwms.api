import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
  Header,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ContributionService } from './contribution.service';
import {
  SearchQueryDto,
  ContributionDto,
  MembershipContributionDto,
  MonthlyContributionDto,
  BereavedMemberContributionDto,
  DeceasedMemberContributionDto,
} from './contribution.dto';
import {
  PaginationTransformPipe,
  PaginationRequestDto,
} from 'src/core/models/dtos/pagination-request.dto';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { User } from 'src/core/models/entities/user.entity';

// @UseGuards(AuthGuard('jwt'))
@Controller('contributions')
export class ContributionController {
  constructor(private contributionService: ContributionService) {}

  @Post()
  async create(
    @Body()
    payload:
      | MembershipContributionDto
      | MonthlyContributionDto
      | BereavedMemberContributionDto
      | DeceasedMemberContributionDto,
    @GetUser() initiator: User,
  ) {
    return await this.contributionService.create(payload);
  }

  @Get()
  async getMany(
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    console.log('queryparams', queryParams);
    return await this.contributionService.readMany(page, take, queryParams);
  }

  @Get('by-welfare/:id')
  async getManyByWelfare(
    @Param('id') id,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.contributionService.readManyByWelfareId(
      id,
      page,
      take,
      queryParams,
    );
  }

  @Get('by-member/:id')
  async getManyByMember(
    @Param('id') id,
    @Query(new PaginationTransformPipe())
    paginationRequest: PaginationRequestDto,
    @Query(new ValidationPipe())
    queryParams: SearchQueryDto,
  ) {
    const { page, take } = paginationRequest;
    return await this.contributionService.readManyByMemberId(
      id,
      page,
      take,
      queryParams,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.contributionService.read(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.contributionService.drop(id);
  }
}
