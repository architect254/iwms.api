import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {
  BereavedMemberContributionDto,
  ContributionDto,
  DeceasedMemberContributionDto,
  MembershipContributionDto,
  MembershipReactivationContributionDto,
  MonthlyContributionDto,
  SearchQueryDto,
} from './contribution.dto';
import {
  BereavedMemberContribution,
  Contribution,
  ContributionType,
  DeceasedMemberContribution,
  MembershipContribution,
  MembershipReactivationContribution,
  MonthlyContribution,
} from './contribution.entity';
import {
  Transaction,
  TransactionStatus,
} from '../transaction/transaction.entity';
import { ClientUserAccount } from '../account/entities/user_account.entity';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution)
    private contributionRepo: Repository<Contribution>,
    @InjectRepository(ClientUserAccount)
    private memberRepo: Repository<ClientUserAccount>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async create(payload: ContributionDto): Promise<Contribution> {
    let contribution: Contribution;

    switch (payload.type) {
      case ContributionType.Membership:
        contribution = new MembershipContribution();
        payload = payload as MembershipContributionDto;
        break;

      case ContributionType.Monthly:
        contribution = new MonthlyContribution();
        payload = payload as MonthlyContributionDto;
        break;

      case ContributionType.BereavedMember:
        contribution = new BereavedMemberContribution();
        payload = payload as BereavedMemberContributionDto;
        break;

      case ContributionType.DeceasedMember:
        contribution = new DeceasedMemberContribution();
        payload = payload as DeceasedMemberContributionDto;
        break;

      case ContributionType.MembershipReActivation:
        contribution = new MembershipReactivationContribution();
        payload = payload as MembershipReactivationContributionDto;
        break;
    }

    contribution = await this.contributionRepo.create(contribution);

    return this.upsert(contribution, payload);
  }

  async read(id): Promise<Contribution> {
    let contribution;

    try {
      contribution = await this.contributionRepo.findOne({
        where: { id },
      });
    } catch (error) {
      contribution = null;
    }

    if (!contribution || !Object.keys(contribution).length) {
      const errorMessage = `Contribution not found`;
      throw new NotFoundException(errorMessage);
    }

    return contribution;
  }

  async readMany(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<Contribution[]> {
    const skip: number = Number(take * (page - 1));

    let contributions = [];

    try {
      contributions = await this.contributionRepo.find({
        skip,
        take,
        where: searchQueryParams,
      });
    } catch (error) {
      contributions = [];
    }

    return contributions;
  }

  async update(id, payload: ContributionDto): Promise<Contribution> {
    const contribution = await this.read(id);
    return this.upsert(contribution, payload);
  }

  async upsert(
    contribution: Contribution,
    payload: ContributionDto,
  ): Promise<Contribution> {
    const { transactionDto, ...contributionFields } = payload;

    Object.assign(contribution, contributionFields);

    if (contributionFields.from) {
      contribution.from = await this.memberRepo.findOneBy({
        id: contributionFields.from,
      });
    }
    if (contributionFields.to) {
      contribution.to = await this.memberRepo.findOneBy({
        id: contributionFields.to,
      });
    }

    let transaction;
    if (transactionDto.id) {
      transaction = this.transactionRepo.findOneBy({ id: transactionDto.id });
    } else {
      transaction = this.transactionRepo.create(new Transaction());
    }

    Object.assign(transaction, transactionDto);

    transaction.from_account = contribution.from.id_number;
    transaction.to_account = contribution.to.id_number;
    transaction.status = TransactionStatus.Committed;

    contribution.transaction = await this.transactionRepo.save(transaction);

    return await this.contributionRepo.save(contribution);
  }

  async drop(id): Promise<void> {
    const contribution: Contribution = await this.read(id);
    const result = await this.contributionRepo.softRemove(contribution);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
