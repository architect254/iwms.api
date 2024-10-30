import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { hash,genSalt } from 'crypto';
import { hash, genSalt } from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';

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
  BereavedMemberDto,
  DeactivatedMemberDto,
  DeceasedMemberDto,
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

  async read(id: string): Promise<Member> {
    let member: Member | BereavedMember | DeceasedMember | DeactivatedMember =
      null;

    try {
      member = await this.memberRepo
        .findOneBy({
          id,
        })
        .then(async (user) => {
          switch (user.membership) {
            case Membership.Active:
              return this.memberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Bereaved:
              return this.bereavedMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Deceased:
              return this.deceasedMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Deactivated:
              return this.deactivatedMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
          }
        });
    } catch (error) {
      throw new Error(error);
    }

    return member;
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
    try {
      switch (membership) {
        case Membership.Active:
          members = await this.memberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Bereaved:
          members = await this.bereavedMemberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Deceased:
          members = await this.deceasedMemberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Deactivated:
          members = await this.deactivatedMemberRepo.find({
            skip,
            take,
          });
          break;
      }
    } catch (error) {
      throw new Error(error);
    }
    return members;
  }

  async update(id, payload: Partial<MemberDto>): Promise<Member> {
    return this.upsert(payload, id);
  }

  async upsert(payload: Partial<MemberDto>, id?: string): Promise<Member> {
    let member: Member, welfare: Welfare, spouse: Spouse, children: Child[];

    return this.memberRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        try {
          if (id) {
            member = await transactionEntityManager.findOneBy<
              Member | BereavedMember | DeceasedMember | DeactivatedMember
            >(Member, {
              id,
            });
          } else {
            member = await transactionEntityManager.create(Member);
          }

          const { welfareDto, spouseDto, childrenDto } = payload as MemberDto;

          if (welfareDto) {
            if (member?.welfare) {
              welfare = member?.welfare;
            } else {
              welfare = new Welfare();
              welfare.members = [];
              welfare = await transactionEntityManager.create(Welfare, welfare);
            }

            Object.assign(welfare, welfareDto);

            member.welfare = await transactionEntityManager.save(welfare);
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
        } catch (error) {
          throw new Error(error);
        }
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
