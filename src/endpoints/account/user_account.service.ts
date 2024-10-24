import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Admin, EntityManager, Repository } from 'typeorm';

import { hash, genSalt } from 'bcrypt';

import {
  AccountType,
  AdminUserAccount,
  ClientUserAccount,
  UserAccount,
} from './entities/user_account.entity';
import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { Welfare } from '../welfare/welfare.entity';

import { CreateUserAccountDto, SearchQueryDto } from './user_account.dto';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountRepo: Repository<UserAccount>,
    @InjectRepository(AdminUserAccount)
    private adminUserAccountRepo: Repository<AdminUserAccount>,
    @InjectRepository(ClientUserAccount)
    private clientUserAccountRepo: Repository<ClientUserAccount>,
  ) {}

  async create(
    payload: CreateUserAccountDto,
  ): Promise<AdminUserAccount | ClientUserAccount> {
    return this.upsert(payload);
  }

  async read(id: string): Promise<AdminUserAccount | ClientUserAccount> {
    let userAccount: AdminUserAccount | ClientUserAccount = null;

    userAccount = await this.userAccountRepo
      .findOneBy({
        id,
      })
      .then(async (userAccount) => {
        if (userAccount.type == AccountType.Admin) {
          return this.adminUserAccountRepo.findOneBy({
            id: userAccount.id,
          });
        } else {
          return this.clientUserAccountRepo.findOne({
            where: { id: userAccount.id },
            relations: {
              welfare: true,
              spouse: true,
              children: true,
            },
          });
        }
      });

    if (!userAccount || !Object.keys(userAccount).length) {
      const errorMessage = `User account not found`;
      throw new NotFoundException(errorMessage);
    }

    return userAccount;
  }

  async readMany(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<UserAccount[]> {
    const skip: number = Number(take * (page - 1));

    let userAccounts: UserAccount[] = [];

    try {
      userAccounts = await this.userAccountRepo.find({
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }

    return userAccounts;
  }

  async readManyAdminUserAccounts(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<AdminUserAccount[]> {
    const skip: number = Number(take * (page - 1));

    let adminUserAccounts: AdminUserAccount[] = [];

    try {
      adminUserAccounts = await this.adminUserAccountRepo.find({
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }

    return adminUserAccounts;
  }

  async readManyClientUserAccounts(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<ClientUserAccount[]> {
    const skip: number = Number(take * (page - 1));

    let clientUserAccounts: ClientUserAccount[] = [];

    try {
      clientUserAccounts = await this.clientUserAccountRepo.find({
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }

    return clientUserAccounts;
  }

  async update(
    id,
    payload: Partial<CreateUserAccountDto>,
  ): Promise<UserAccount> {
    return this.upsert(payload, id);
  }

  async upsert(
    payload: Partial<CreateUserAccountDto>,
    id?: string,
  ): Promise<AdminUserAccount | ClientUserAccount> {
    const { welfareDto, spouseDto, childrenDto, ...userAccountFields } =
      payload;

    let userAccount: AdminUserAccount | ClientUserAccount,
      welfare: Welfare,
      spouse: Spouse,
      children: Child[];

    return await new Promise<AdminUserAccount | ClientUserAccount>(
      (resolve, reject) => {
        this.userAccountRepo.manager.transaction(
          async (transactionEntityManager: EntityManager) => {
            /**
             * Assigns payload data to ClientUserAccount Object
             *
             * @param userAccount object of type ClientUserAccount
             * @returns Promise<ClientUserAccount>
             */
            async function assignClientUserAccountPayloadData(
              userAccount: ClientUserAccount,
            ): Promise<ClientUserAccount> {
              if (welfareDto) {
                if (userAccount.welfare) {
                  welfare = userAccount.welfare;
                } else {
                  welfare = new Welfare();
                  welfare.members = [];
                  welfare = await transactionEntityManager.create(
                    Welfare,
                    welfare,
                  );
                }

                Object.assign(welfare, welfareDto);

                userAccount.welfare =
                  await transactionEntityManager.save(welfare);

                if (spouseDto) {
                  if (userAccount.spouse) {
                    spouse = userAccount.spouse;
                  } else {
                    spouse = new Spouse();
                    spouse = await transactionEntityManager.create(
                      Spouse,
                      spouse,
                    );
                  }

                  Object.assign(spouse, spouseDto);

                  userAccount.spouse = await this.spouseRepo.save(spouse);
                }

                if (childrenDto) {
                  if (userAccount.children.length) {
                    children = userAccount.children;
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

                  userAccount.children =
                    await transactionEntityManager.save(children);
                }
                return await transactionEntityManager.save(userAccount);
              }
            }

            /**
             * Assigns payload data to UserAccount Object
             *
             * @param userAccount object of type UserAccount
             * @returns Promise<ClientUserAccount>
             */
            async function assignUserAccountPayloadData(
              userAccount: AdminUserAccount | ClientUserAccount,
            ) {
              Object.assign(userAccount, userAccountFields);

              userAccount.salt = await genSalt();
              userAccount.password = await hash(
                'Password@123',
                userAccount.salt,
              );

              userAccount = await transactionEntityManager.save(userAccount);

              delete userAccount.password && delete userAccount.salt;

              return userAccount;
            }

            if (id) {
              switch (payload.type) {
                case AccountType.Admin:
                  userAccount = await transactionEntityManager.findOneBy(
                    AdminUserAccount,
                    { id },
                  );

                  userAccount = await assignUserAccountPayloadData(userAccount);
                  break;
                case AccountType.Client:
                  userAccount = await transactionEntityManager.findOneBy(
                    ClientUserAccount,
                    { id },
                  );
                  userAccount =
                    await assignClientUserAccountPayloadData(userAccount);
                  userAccount = await assignUserAccountPayloadData(userAccount);
                  break;
              }
            } else {
              switch (payload.type) {
                case AccountType.Admin:
                  userAccount =
                    await transactionEntityManager.create(AdminUserAccount);
                  userAccount = await assignUserAccountPayloadData(userAccount);
                  break;
                case AccountType.Client:
                  userAccount =
                    await transactionEntityManager.create(ClientUserAccount);
                  userAccount =
                    await assignClientUserAccountPayloadData(userAccount);
                  userAccount = await assignUserAccountPayloadData(userAccount);
                  break;
              }
            }
          },
        );
        resolve(userAccount);
      },
    );
  }

  async drop(id): Promise<void> {
    const account: AdminUserAccount | ClientUserAccount = await this.read(id);
    const result = await this.userAccountRepo.remove(account);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
