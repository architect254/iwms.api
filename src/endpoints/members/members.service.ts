import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, genSalt } from 'bcrypt';
import { Repository, EntityManager, ILike, Like } from 'typeorm';

import {
  Member,
  BereavedMember,
  Child,
  DeactivatedMember,
  DeceasedMember,
  Membership,
  Spouse,
} from './entities';
import {
  MemberDto,
  IsDeceasedMemberDto,
  IsBereavedMemberDto,
  IsDeactivatedMemberDto,
} from './dtos';
import { Welfare } from '../welfares/welfare.entity';
import { SearchQueryDto } from './dtos/member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(BereavedMember)
    private bereavedMemberRepo: Repository<BereavedMember>,
    @InjectRepository(DeceasedMember)
    private deceasedMemberRepo: Repository<DeceasedMember>,
    @InjectRepository(DeactivatedMember)
    private deactivatedMemberRepo: Repository<DeactivatedMember>,
  ) {}

  async create(payload: MemberDto): Promise<Member> {
    return this.upsert(payload);
  }

  async read(id: string): Promise<Member | BereavedMember | DeceasedMember | DeactivatedMember> {
    let member: Member | BereavedMember | DeceasedMember | DeactivatedMember =
      null;
    member = await this.memberRepo.findOne({
      where: { id },
      relations: {
        spouse: true,
        children: true,
        welfare: true,
        contributions: true,
      },
    });

    if (!member) {
      member = await this.bereavedMemberRepo.findOne({
        where: { id },
        relations: {
          spouse: true,
          children: true,
          welfare: true,
          contributions: true,
        },
      });
    }

    if (!member) {
      member = await this.deceasedMemberRepo.findOne({
        where: { id },
        relations: {
          spouse: true,
          children: true,
          welfare: true,
          contributions: true,
        },
      });
    }

    if (!member) {
      member = await this.deactivatedMemberRepo.findOne({
        where: { id },
        relations: {
          spouse: true,
          children: true,
          welfare: true,
          contributions: true,
        },
      });
    }

    return member;
  }

  async search(page: number = 1, take: number = 100, name: string) {
    const skip: number = Number(take * (page - 1));
    let members;

    members = await this.memberRepo
      .find({
        skip,
        take,
        where: { name: ILike(`%${name}%`) },
      })
      .then((members) => {
        return members.map((member) => {
          const { id, id_number, name } = member;
          return { id, name: `${name} (${id_number})` };
        });
      });

    return members;
  }

  async readMany(
    page: number = 1,
    take: number = 100,
    searchQueryParams?: SearchQueryDto,
  ): Promise<(Member | BereavedMember | DeceasedMember | DeactivatedMember)[]> {
    const skip: number = Number(take * (page - 1));
    let members: (
      | Member
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember
    )[];
    const { membership } = searchQueryParams;
    switch (membership) {
      case Membership.Bereaved:
        members = await this.bereavedMemberRepo.find({
          skip,
          take,
          relations: { spouse: true, children: true, contributions: true },
        });
        break;

      case Membership.Deceased:
        members = await this.deceasedMemberRepo.find({
          skip,
          take,
          relations: { spouse: true, children: true, contributions: true },
        });
        break;

      case Membership.Deactivated:
        members = await this.deactivatedMemberRepo.find({
          skip,
          take,
          relations: { spouse: true, children: true, contributions: true },
        });
        break;
      default:
        members = await this.memberRepo.find({
          skip,
          take,
          relations: { spouse: true, children: true, contributions: true, },
        });
        break;
    }

    return members;
  }

  async readManyByWelfareId(
    id: string,
    page: number,
    take: number,
    searchQueryParams?: SearchQueryDto,
  ): Promise<Member[]> {
    const skip: number = Number(take * (page - 1));
    let members: (
      | Member
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember
    )[];
    const { membership } = searchQueryParams;
    switch (membership) {
      case Membership.Bereaved:
        members = await this.bereavedMemberRepo.find({
          skip,
          take,
          where: { welfareId: id },
          relations: { spouse: true, children: true, contributions: true },
        });
        break;

      case Membership.Deceased:
        members = await this.deceasedMemberRepo.find({
          skip,
          take,
          where: { welfareId: id },
          relations: { spouse: true, children: true, contributions: true },
        });
        break;

      case Membership.Deactivated:
        members = await this.deactivatedMemberRepo.find({
          skip,
          take,
          where: { welfareId: id },
          relations: { spouse: true, children: true, contributions: true },
        });
        break;
      default:
        members = await this.memberRepo.find({
          skip,
          take,
          where: { welfareId: id },
          relations: { spouse: true, children: true, contributions: true },
        });
        break;
    }

    return members;
  }

  async update(id, payload: Partial<MemberDto>): Promise<Member> {
    return this.upsert(payload, id);
  }

  async isBereaved(id, payload: IsBereavedMemberDto) {
    return this.bereavedMemberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (id) {
          const bereavedMember = Object.assign(new BereavedMember(), payload, {
            membership: Membership.Bereaved,
          });
          await transactionEntityManager.update(Member, { id }, bereavedMember);
        }
      },
    );
  }

  async isDeceased(id, payload: IsDeceasedMemberDto) {
    return this.deceasedMemberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (id) {
          const deceasedMember = Object.assign(new DeceasedMember(), payload, {
            membership: Membership.Deceased,
          });
          await transactionEntityManager.update(Member, { id }, deceasedMember);
        }
      },
    );
  }

  async isDeactivated(id, payload: IsDeactivatedMemberDto) {
    return this.deactivatedMemberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (id) {
          const deactivatedMemberRepo = Object.assign(
            new DeactivatedMember(),
            payload,
            {
              membership: Membership.Deactivated,
              deactivation_date: new Date(Date.now()),
            },
          );
          await transactionEntityManager.update(
            Member,
            { id },
            deactivatedMemberRepo,
          );
        }
      },
    );
  }

  async activate(id) {
    return this.memberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (id) {
          const activeMember = Object.assign(new Member(), {
            membership: Membership.Active,
          });
          await transactionEntityManager.update(Member, { id }, activeMember);
        }
      },
    );
  }

  async upsert(payload: Partial<MemberDto>, id?: string): Promise<Member> {
    let member: Member, welfare: Welfare, spouse: Spouse, children: Child[];

    return this.memberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        if (id) {
          member = await transactionEntityManager.findOneBy<
            Member | BereavedMember | DeceasedMember | DeactivatedMember
          >(Member, {
            id,
          });
        } else {
          member = await transactionEntityManager.create(Member);
        }

        const { welfareId, spouseDto, childrenDto } = payload as MemberDto;

        if (welfareId) {
          member.welfare = await transactionEntityManager.findOneBy(Welfare, {
            id: welfareId,
          });
        }

        if (spouseDto) {
          if (member?.spouse) {
            spouse = member?.spouse;
          } else {
            spouse = new Spouse();
            spouse = await transactionEntityManager.create(Spouse, spouse);
          }

          Object.assign(spouse, spouseDto);

          member.spouse = await transactionEntityManager.save(spouse);
        }

        if (childrenDto) {
          if (member?.children?.length) {
            children = member?.children;
          } else {
            children = new Array<Child>(childrenDto.length).fill(new Child());
            children = await transactionEntityManager.create(Child, children);
          }
          for (let index = 0; index < childrenDto.length; index++) {
            Object.assign(children[index], childrenDto[index]);
          }

          member.children = await transactionEntityManager.save(children);
        }

        /**
         *
         * Assigns payload data to UserAccount Object
         *
         */
        Object.assign(member, payload);

        member.salt = await genSalt();
        member.password = await hash('Password@123', member.salt);

        member = await transactionEntityManager.save(member);

        delete member.password && delete member.salt;

        return member;
      },
    );
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
