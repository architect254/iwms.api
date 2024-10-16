import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { hash, genSalt } from 'bcrypt';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { Account } from './entities/account.entity';

import {
  CreateAccountDto,
  UpdateAccountDto,
  SearchQueryDto,
} from './account.dto';
import { Member } from '../member/member.entity';
import { Welfare } from '../welfare/welfare.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Spouse)
    private spouseRepo: Repository<Spouse>,
    @InjectRepository(Child)
    private childRepo: Repository<Child>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Welfare)
    private welfareRepo: Repository<Welfare>,
  ) {}

  async create(payload: CreateAccountDto): Promise<Account> {
    const account = await this.accountRepo.create(new Account());

    return this.upsert(account, payload);
  }

  async read(id: number): Promise<Account> {
    let account = null;

    account = await this.accountRepo.findOne({
      where: { id },
      relations: {
        membership: { welfare: true },
        spouse: true,
        children: true,
      },
    });

    if (!account || !Object.keys(account).length) {
      const errorMessage = `Account not found`;
      throw new NotFoundException(errorMessage);
    }

    return account;
  }

  async readMany(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<any[]> {
    const skip: number = Number(take * (page - 1));

    let accounts = [];

    try {
      accounts = await this.accountRepo.find({
        skip,
        take,
        where: searchQueryParams,
        relations: {
          membership: { welfare: true },
          spouse: true,
          children: true,
        },
      });
    } catch (error) {
      accounts = [];
    }

    return accounts;
  }

  async update(id, payload: UpdateAccountDto): Promise<Account> {
    const account = await this.read(id);
    return this.upsert(account, payload);
  }

  async upsert(account: Account, payload: UpdateAccountDto): Promise<Account> {
    const { accountDto, spouseDto, childrenDto, memberDto, welfareDto } =
      payload;

    let membership: Member, welfare: Welfare, spouse: Spouse, children: Child[];

    Object.assign(account, accountDto);

    if (memberDto.role) {
      if (account.membership) {
        membership = await this.memberRepo.findOneBy({
          id: account.membership?.id,
        });
      } else {
        membership = new Member();
        membership = await this.memberRepo.create(membership);
      }

      Object.assign(membership, memberDto);
      if (welfareDto) {
        if (membership.welfare.id) {
          welfare = await this.welfareRepo.findOneBy({
            id: membership.welfare.id,
          });
        } else {
          welfare = new Welfare();
          welfare.members = [];
          welfare = await this.welfareRepo.create(welfare);

          Object.assign(welfare, welfareDto);
        }
      }

      if (spouseDto) {
        if (account.spouse) {
          spouse = await this.spouseRepo.findOneBy({ id: account.spouse?.id });
        } else {
          spouse = new Spouse();
          spouse = await this.spouseRepo.create(spouse);
        }

        Object.assign(spouse, spouseDto);
      }

      if (childrenDto) {
        if (account.children) {
          children = await this.childRepo.findBy({ parent: account });
        } else {
          children = new Array<Child>(childrenDto.length).fill(new Child());
          children = await this.childRepo.create(children);
        }

        for (let index = 0; index < childrenDto.length; index++) {
          Object.assign(children[index], childrenDto[index]);
        }
        await this.childRepo.save(children);
      }
    }

    account.children = children;
    account.salt = await genSalt();
    account.password = await hash('Password@123', account.salt);

    await this.accountRepo.save(account);
    if (spouse) {
      spouse.spouse = account;
      await this.spouseRepo.save(spouse);
    }
    if (membership) {
      membership.account = account;
      await this.memberRepo.save(membership);
    }
    if (welfare) {
      membership.welfare = welfare;
      await this.welfareRepo.save(welfare);
    }

    delete account.password && delete account.salt;

    return account;
  }

  async save(account: Account): Promise<Account> {
    try {
      return await this.accountRepo.save(account);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Account Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async drop(id): Promise<void> {
    const account: Account = await this.read(id);
    const result = await this.accountRepo.remove(account);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
