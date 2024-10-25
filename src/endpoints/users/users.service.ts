import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { hash,genSalt } from 'crypto';
import { hash, genSalt } from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';

import {
  ActiveMember,
  Admin,
  BereavedMember,
  Child,
  DeactivatedMember,
  DeceasedMember,
  Membership,
  Spouse,
  User,
} from './entities';
import { Welfare } from '../welfare/welfare.entity';
import {
  ActiveMemberDto,
  AdminDto,
  BereavedMemberDto,
  DeactivatedMemberDto,
  DeceasedMemberDto,
  SearchQueryDto,
  UserDto,
} from './dtos';

@Injectable()
export class UserMembershipService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(ActiveMember)
    private activeMemberRepo: Repository<ActiveMember>,
    @InjectRepository(BereavedMember)
    private bereavedMemberRepo: Repository<BereavedMember>,
    @InjectRepository(DeceasedMember)
    private deceasedMemberRepo: Repository<DeceasedMember>,
    @InjectRepository(DeactivatedMember)
    private deactivatedMemberRepo: Repository<DeactivatedMember>,
  ) {}

  async create(
    payload:
      | AdminDto
      | ActiveMemberDto
      | BereavedMemberDto
      | DeceasedMemberDto
      | DeactivatedMemberDto,
  ): Promise<
    Admin | ActiveMember | BereavedMember | DeceasedMember | DeactivatedMember
  > {
    return this.upsert(payload);
  }

  async read(
    id: string,
  ): Promise<
    Admin | ActiveMember | BereavedMember | DeceasedMember | DeactivatedMember
  > {
    let user:
      | Admin
      | ActiveMember
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember = null;

    try {
      user = await this.userRepo
        .findOneBy({
          id,
        })
        .then(async (user) => {
          switch (user.membership) {
            case Membership.Admin:
              return this.adminRepo.findOneBy({
                id: user.id,
              });
            case Membership.Active:
              return this.activeMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Bereaved:
              return this.activeMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Deceased:
              return this.activeMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
            case Membership.Deactivated:
              return this.activeMemberRepo.findOne({
                where: { id: user.id },
                relations: { spouse: true, children: true, welfare: true },
              });
          }
        });
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }

  async readMany(
    membership: Membership,
    page: number = 1,
    take: number = 100,
    searchQueryParams?: SearchQueryDto,
  ): Promise<
    (
      | User
      | Admin
      | ActiveMember
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember
    )[]
  > {
    const skip: number = Number(take * (page - 1));
    let users: (
      | User
      | Admin
      | ActiveMember
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember
    )[];
    try {
      switch (membership) {
        case Membership.Admin:
          users = await this.adminRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Active:
          users = await this.activeMemberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Bereaved:
          users = await this.bereavedMemberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Deceased:
          users = await this.deceasedMemberRepo.find({
            skip,
            take,
          });
          break;

        case Membership.Deactivated:
          users = await this.deactivatedMemberRepo.find({
            skip,
            take,
          });
          break;
        default:
          users = await this.userRepo.find({
            skip,
            take,
          });
      }
    } catch (error) {
      throw new Error(error);
    }
    return users;
  }

  async update(
    id,
    payload: Partial<
      | AdminDto
      | ActiveMemberDto
      | BereavedMemberDto
      | DeceasedMemberDto
      | DeactivatedMemberDto
    >,
  ): Promise<
    Admin | ActiveMember | BereavedMember | DeceasedMember | DeactivatedMember
  > {
    return this.upsert(payload, id);
  }

  async upsert(
    payload: Partial<
      | AdminDto
      | ActiveMemberDto
      | BereavedMemberDto
      | DeceasedMemberDto
      | DeactivatedMemberDto
    >,
    id?: string,
  ): Promise<
    Admin | ActiveMember | BereavedMember | DeceasedMember | DeactivatedMember
  > {
    const { membership } = payload;
    let user:
        | Admin
        | ActiveMember
        | BereavedMember
        | DeceasedMember
        | DeactivatedMember,
      welfare: Welfare,
      spouse: Spouse,
      children: Child[];

    return this.userRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        try {
          async function getUser(
            id: string,
            user:
              | Admin
              | ActiveMember
              | BereavedMember
              | DeceasedMember
              | DeactivatedMember,
          ): Promise<
            | Admin
            | ActiveMember
            | BereavedMember
            | DeceasedMember
            | DeactivatedMember
          > {
            if (id) {
              return await transactionEntityManager.findOneBy(User, { id });
            } else {
              return await transactionEntityManager.create(User);
            }
          }
          switch (membership) {
            case Membership.Admin:
              user = await getUser(id, new Admin());

              break;
            case Membership.Active:
              user = await getUser(id, new ActiveMember());

              const { welfareDto, spouseDto, childrenDto } =
                payload as ActiveMemberDto;

              if (welfareDto) {
                if ((<ActiveMember>user)?.welfare) {
                  welfare = (<ActiveMember>user)?.welfare;
                } else {
                  welfare = new Welfare();
                  welfare.members = [];
                  welfare = await transactionEntityManager.create(
                    Welfare,
                    welfare,
                  );
                }

                Object.assign(welfare, welfareDto);

                (<ActiveMember>user).welfare =
                  await transactionEntityManager.save(welfare);
              }

              if (spouseDto) {
                if ((<ActiveMember>user)?.spouse) {
                  spouse = (<ActiveMember>user)?.spouse;
                } else {
                  spouse = new Spouse();
                  spouse = await transactionEntityManager.create(
                    Spouse,
                    spouse,
                  );
                }

                Object.assign(spouse, spouseDto);

                (<ActiveMember>user).spouse =
                  await transactionEntityManager.save(spouse);
              }

              if (childrenDto) {
                if ((<ActiveMember>user)?.children?.length) {
                  children = (<ActiveMember>user)?.children;
                } else {
                  children = new Array<Child>(childrenDto.length).fill(
                    new Child(),
                  );
                  children = await transactionEntityManager.create(
                    Child,
                    children,
                  );
                }
                for (let index = 0; index < childrenDto.length; index++) {
                  Object.assign(children[index], childrenDto[index]);
                }

                (<ActiveMember>user).children =
                  await transactionEntityManager.save(children);
              }
              break;

            case Membership.Bereaved:
              user = (await getUser(
                id,
                new BereavedMember(),
              )) as BereavedMember;

              const { deceased, bereavement_date, relationship_with_deceased } =
                payload as BereavedMemberDto;

              Object.assign(user, {
                deceased,
                bereavement_date,
                relationship_with_deceased,
              });
              break;

            case Membership.Deceased:
              user = (await getUser(
                id,
                new DeceasedMember(),
              )) as DeceasedMember;

              const { demise_date } = payload as DeceasedMemberDto;

              Object.assign(user, {
                demise_date,
              });
              break;

            case Membership.Deactivated:
              user = (await getUser(
                id,
                new DeactivatedMember(),
              )) as DeactivatedMember;

              const { reason } = payload as DeactivatedMemberDto;

              Object.assign(user, {
                reason,
                deactivation_date: new Date(),
              });
              break;
          }

          /**
           *
           * Assigns payload data to UserAccount Object
           *
           */
          Object.assign(user, payload as UserDto);

          user.salt = await genSalt();
          user.password = await hash('Password@123', user.salt);

          user = await transactionEntityManager.save(user);

          delete user.password && delete user.salt;
        } catch (error) {
          throw new Error(error);
        }
        return user;
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
