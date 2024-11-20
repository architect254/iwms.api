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
import {
  Member,
  BereavedMember,
  DeceasedMember,
  DeactivatedMember,
  Membership,
} from '../members/entities';
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
        let { memberId, amount, type, accountName } = payload;
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
            let { bereavedMemberId } = payload as BereavedMemberContributionDto;

            if (bereavedMemberId) {
              if (bereavedMemberId.includes('(')) {
                bereavedMemberId = bereavedMemberId.split('(')[1];
              }
              bereavedMemberId = bereavedMemberId.trim();
              if (bereavedMemberId.includes(')')) {
                bereavedMemberId = bereavedMemberId.split(')')[0];
              }
              const id_number = bereavedMemberId.trim();
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
            let { deceasedMemberId } = payload as DeceasedMemberContributionDto;
            if (deceasedMemberId) {
              if (deceasedMemberId.includes('(')) {
                deceasedMemberId = deceasedMemberId.split('(')[1];
              }
              deceasedMemberId = deceasedMemberId.trim();
              if (deceasedMemberId.includes(')')) {
                deceasedMemberId = deceasedMemberId.split(')')[0];
              }
              const id_number = deceasedMemberId.trim();
              const member = await transactionEntityManager.findOne(
                DeceasedMember,
                {
                  where: { id_number },
                },
              );
              (contribution as DeceasedMemberContribution).deceasedMember =
                member;
            }
            break;
          case ContributionType.MembershipReactivation:
            contribution = await transactionEntityManager.create(
              MembershipReactivationContribution,
            );

            if (memberId.includes('(')) {
              memberId = memberId.split('(')[1];
            }
            memberId = memberId.trim();
            if (memberId.includes(')')) {
              memberId = memberId.split(')')[0];
            }
            const id_number = memberId.trim();
            const member = await transactionEntityManager.findOne(
              DeactivatedMember,
              {
                where: { id_number },
              },
            );

            contribution.member = member;

            this.memberRepo.manager.transaction(
              async (transactionEntityManager: EntityManager) => {
                if (member.id) {
                  const activeMember = Object.assign(new Member(), {
                    membership: Membership.Active,
                  });
                  await transactionEntityManager.update(
                    Member,
                    { id: member.id },
                    activeMember,
                  );
                }
              },
            );
            break;
        }

        if (memberId && type != ContributionType.MembershipReactivation) {
          if (memberId.includes('(')) {
            memberId = memberId.split('(')[1];
          }
          memberId = memberId.trim();
          if (memberId.includes(')')) {
            memberId = memberId.split(')')[0];
          }
          const id_number = memberId.trim();
          let member;
          member = await transactionEntityManager.findOne(Member, {
            where: { id_number },
          });
          contribution.member = member;
        }

        contribution.type = type as ContributionType;
        contribution.amount = amount;

        contribution.account = await transactionEntityManager.findOne(Account, {
          where: { name: accountName },
        });

        contribution.account.current_amount =
          Number(contribution.account.current_amount) + Number(amount);

        await transactionEntityManager.save(contribution.account);

        const welfare = await transactionEntityManager.findOne(Welfare, {
          where: { id: contribution.account.welfare.id },
        });

        welfare.totalContributionsAmount =
          Number(welfare.totalContributionsAmount) + Number(amount);

        await transactionEntityManager.save(welfare);

        contribution = await transactionEntityManager.save(contribution);
        return contribution;
      },
    );
  }

  async read(
    id: string,
  ): Promise<
    | MembershipContribution
    | MonthlyContribution
    | BereavedMemberContribution
    | DeceasedMemberContribution
    | MembershipReactivationContribution
  > {
    return await this.contributionRepo
      .findOne({
        where: { id },
        relations: { member: true, account: true },
      })
      .then(async (contribution) => {
        switch (contribution.type) {
          case ContributionType.Membership:
            contribution = await this.membershipContributionRepo.findOne({
              where: { id },
              relations: { member: true, account: true },
            });
            return contribution;
          case ContributionType.Monthly:
            contribution = await this.monthlyContributionRepo.findOne({
              where: { id },
              relations: { member: true, account: true },
            });
            return contribution;
          case ContributionType.BereavedMember:
            contribution = await this.bereavedMemberContributionRep.findOne({
              where: { id },
              relations: { member: true, bereavedMember: true, account: true },
            });
            return contribution;
          case ContributionType.DeceasedMember:
            contribution = await this.deceasedMemberRepo.findOne({
              where: { id },
              relations: { member: true, deceasedMember: true, account: true },
            });
            return contribution;
          case ContributionType.MembershipReactivation:
            contribution =
              await this.membershipReactivationContributionRepo.findOne({
                where: { id },
                relations: { member: true, account: true },
              });
            return contribution;
        }
      });
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
    console.log('param type', type);

    switch (type) {
      case ContributionType.Membership:
        contributions = await this.membershipContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true, account: true },
        });
        console.log('memberhip contriution 0', type);
        break;

      case ContributionType.Monthly:
        contributions = await this.monthlyContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true, account: true },
        });
        break;

      case ContributionType.BereavedMember:
        contributions = await this.bereavedMemberContributionRep.find({
          skip,
          take,
          where: { type },
          relations: { member: true, account: true, bereavedMember: true },
        });
        break;
      case ContributionType.DeceasedMember:
        contributions = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true, account: true, deceasedMember: true },
        });
        break;
      case ContributionType.MembershipReactivation:
        contributions = await this.membershipReactivationContributionRepo.find({
          skip,
          take,
          where: { type },
          relations: { member: true, account: true },
        });
        break;
      default:
        contributions = await this.contributionRepo.find({
          skip,
          take,
          relations: { member: true, account: true },
        });
        console.log('all contriution 1', type);

        break;
    }

    return contributions;
  }

  async readManyByWelfareId(
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
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true },
        });
        break;

      case ContributionType.Monthly:
        contributions = await this.monthlyContributionRepo.find({
          skip,
          take,
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true },
        });
        break;

      case ContributionType.BereavedMember:
        contributions = await this.bereavedMemberContributionRep.find({
          skip,
          take,
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true, bereavedMember: true },
        });
        break;
      case ContributionType.DeceasedMember:
        contributions = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true, deceasedMember: true },
        });
        break;
      case ContributionType.MembershipReactivation:
        contributions = await this.membershipReactivationContributionRepo.find({
          skip,
          take,
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true },
        });
        break;
      default:
        contributions = await this.contributionRepo.find({
          skip,
          take,
          where: { account: { welfare: { id } } },
          relations: { member: true, account: true },
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
          relations: { member: true, account: true },
        });
        break;

      case ContributionType.Monthly:
        contributions = await this.monthlyContributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, account: true },
        });
        break;

      case ContributionType.BereavedMember:
        contributions = await this.bereavedMemberContributionRep.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, account: true, bereavedMember: true },
        });
        break;
      case ContributionType.DeceasedMember:
        contributions = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, account: true, deceasedMember: true },
        });
        break;
      case ContributionType.MembershipReactivation:
        contributions = await this.membershipReactivationContributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, account: true },
        });
        break;
      default:
        contributions = await this.contributionRepo.find({
          skip,
          take,
          where: { member: { id } },
          relations: { member: true, account: true },
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
