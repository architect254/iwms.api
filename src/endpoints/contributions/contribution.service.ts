import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';
import {
  BereavedMemberContributionDto,
  DeceasedMemberContributionDto,
  MembershipContributionDto,
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
import { Member, BereavedMember } from '../members/entities';
import { Account } from '../finance/entities';
import { Welfare } from '../welfares/welfare.entity';

@Injectable()
export class ContributionService {
  constructor(
    @InjectRepository(Contribution)
    private contributionRepo: Repository<Contribution>,
    @InjectRepository(MembershipContribution)
    private membershipContributionRepo: Repository<MembershipContribution>,
    @InjectRepository(MonthlyContribution)
    private monthlyContributionRepo: Repository<MonthlyContribution>,
    @InjectRepository(BereavedMemberContribution)
    private bereavedMemberContributionRep: Repository<BereavedMemberContribution>,
    @InjectRepository(DeceasedMemberContribution)
    private deceasedMemberRepo: Repository<DeceasedMemberContribution>,
    @InjectRepository(MembershipReactivationContribution)
    private membershipReactivationContributionRepo: Repository<MembershipReactivationContribution>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async create(
    payload:
      | MembershipContributionDto
      | MonthlyContributionDto
      | BereavedMemberContributionDto
      | DeceasedMemberContributionDto,
  ): Promise<
    | MembershipContribution
    | MonthlyContribution
    | BereavedMemberContribution
    | DeceasedMemberContribution
  > {
    let contribution:
      | MembershipContribution
      | MonthlyContribution
      | BereavedMemberContribution
      | DeceasedMemberContribution;

    return this.contributionRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const { memberId, amount, type, accountId } = payload;
        switch (type as ContributionType) {
          case ContributionType.Membership:
            contribution = await transactionEntityManager.create(
              MembershipContribution,
            );
            break;
          case ContributionType.Monthly:
            contribution =
              await transactionEntityManager.create(MonthlyContribution);

            const { for_month } = payload as MonthlyContributionDto;
            (contribution as MonthlyContribution).for_month = for_month;
            break;
          case ContributionType.BereavedMember:
            contribution = await transactionEntityManager.create(
              BereavedMemberContribution,
            );
            const { bereavedMemberId } =
              payload as BereavedMemberContributionDto;
            if (bereavedMemberId) {
              let id_number = memberId.split('(').pop()?.split(')').shift();
              const member = await transactionEntityManager.findOne(
                BereavedMember,
                {
                  where: { id_number },
                },
              );
              (contribution as BereavedMemberContribution).bereavedMember =
                member;
            }
            break;
          case ContributionType.DeceasedMember:
            contribution = await transactionEntityManager.create(
              DeceasedMemberContribution,
            );
            const { deceasedMemberId } =
              payload as DeceasedMemberContributionDto;
            if (deceasedMemberId) {
              let id_number = memberId.split('(').pop()?.split(')').shift();
              const member = await transactionEntityManager.findOne(
                BereavedMember,
                {
                  where: { id_number },
                },
              );
              (contribution as BereavedMemberContribution).bereavedMember =
                member;
            }
            break;
        }

        if (memberId) {
          let id_number = memberId.split('(').pop()?.split(')').shift();
          const member = await transactionEntityManager.findOne(Member, {
            where: { id_number },
          });
          contribution.member = member;
        }

        contribution.type = type as ContributionType;
        contribution.amount = amount;

        contribution.account = await transactionEntityManager.findOne(Account, {
          where: { id: accountId },
        });

        contribution.account.current_amount =
          contribution.account.current_amount + amount;

        await transactionEntityManager.save(contribution.account);

        const welfare = await transactionEntityManager.findOne(Welfare, {
          where: { id: contribution.account.welfare.id },
        });

        welfare.totalContributionsAmount =
          welfare.totalContributionsAmount + amount;

        await transactionEntityManager.save(welfare);

        contribution = await transactionEntityManager.save(contribution);

        return contribution;
      },
    );
  }

  async read(id: string): Promise<Contribution> {
    let contribution:
      | Contribution
      | MembershipContribution
      | MonthlyContribution
      | BereavedMemberContribution
      | DeceasedMemberContribution
      | MembershipReactivationContribution = null;
    contribution = await this.contributionRepo.findOne({
      where: { id },
      relations: { member: true },
    });

    if (!contribution) {
      contribution = await this.membershipContributionRepo.findOne({
        where: { id },
        relations: { member: true },
      });
    }

    if (!contribution) {
      contribution = await this.monthlyContributionRepo.findOne({
        where: { id },
        relations: { member: true },
      });
    }

    if (!contribution) {
      contribution = await this.bereavedMemberContributionRep.findOne({
        where: { id },
        relations: { member: true, bereavedMember: true },
      });
    }

    if (!contribution) {
      contribution = await this.deceasedMemberRepo.findOne({
        where: { id },
        relations: { member: true, deceasedMember: true },
      });
    }

    if (!contribution) {
      contribution = await this.membershipReactivationContributionRepo.findOne({
        where: { id },
        relations: { member: true },
      });
    }

    return contribution;
  }

  async readMany(
    page: number = 1,
    take: number = 100,
    searchQueryParams?: SearchQueryDto,
  ): Promise<
    (
      | Contribution
      | MembershipContribution
      | MonthlyContribution
      | BereavedMemberContribution
      | DeceasedMemberContribution
      | MembershipReactivationContribution
    )[]
  > {
    const skip: number = Number(take * (page - 1));
    let contributions: (
      | Contribution
      | MembershipContribution
      | MonthlyContribution
      | BereavedMemberContribution
      | DeceasedMemberContribution
      | MembershipReactivationContribution
    )[];
    let { type } = searchQueryParams;
    type = type as ContributionType;
    switch (type) {
      case ContributionType.Membership:
        contributions = await this.membershipContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true },
        });
        break;

      case ContributionType.Monthly:
        contributions = await this.monthlyContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true },
        });
        break;

      case ContributionType.BereavedMember:
        contributions = await this.bereavedMemberContributionRep.find({
          skip,
          take,
          where: { type },
          relations: { member: true, bereavedMember: true },
        });
        break;
      case ContributionType.DeceasedMember:
        contributions = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true, deceasedMember: true },
        });
        break;
      case ContributionType.MembershipReactivation:
        contributions = await this.membershipReactivationContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true },
        });
        break;
      default:
        contributions = await this.contributionRepo.find({
          skip,
          take,
          relations: { member: true },
        });
        break;
    }

    return contributions;
  }

  async readManyByMemberId(
    id: string,
    page: number,
    take: number,
    searchQueryParams?: SearchQueryDto,
  ): Promise<Contribution[]> {
    const skip: number = Number(take * (page - 1));
    let contributions: (
      | MembershipContribution
      | MonthlyContribution
      | BereavedMemberContribution
      | DeceasedMemberContribution
      | MembershipContribution
    )[];
    const { type } = searchQueryParams;
    switch (type) {
      case ContributionType.Membership:
        contributions = await this.membershipContributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true },
        });
        break;

      case ContributionType.Monthly:
        contributions = await this.monthlyContributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true },
        });
        break;

      case ContributionType.BereavedMember:
        contributions = await this.bereavedMemberContributionRep.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, bereavedMember: true },
        });
        break;
      case ContributionType.DeceasedMember:
        contributions = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, deceasedMember: true },
        });
        break;
      case ContributionType.MembershipReactivation:
        contributions = await this.membershipReactivationContributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true },
        });
        break;
      default:
        contributions = await this.contributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true },
        });
        break;
    }

    return contributions;
  }

  async drop(id): Promise<void> {
    //   const account: AdminUserAccount | ClientUserAccount = await this.read(id);
    //   const result = await this.userAccountRepo.remove(account);
    //   if (!result) {
    //     const errorMessage = `Operation Failed:DELETE`;
    //     throw new InternalServerErrorException(errorMessage);
    //   }
    // }
  }
}
