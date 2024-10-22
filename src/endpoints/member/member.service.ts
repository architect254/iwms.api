import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Member } from './member.entity';
import { CreateMemberDto, SearchQueryDto, UpdateMemberDto } from './member.dto';
import { hash, genSalt } from 'bcrypt';
import { Account } from '../account/entities/account.entity';
import { Child } from '../account/entities/child.entity';
import { Spouse } from '../account/entities/spouse.entity';
import { Welfare } from '../welfare/welfare.entity';

@Injectable()
export class MemberService {
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

  async create(payload: CreateMemberDto): Promise<Member> {
    const member = await this.memberRepo.create(new Member());
    return this.upsert(member, payload);
  }

  async read(id): Promise<Member> {
    let member = null;

    member = await this.memberRepo.findOne({
      where: { id },
      relations: { welfare: true, account: { spouse: true, children: true } },
    });

    if (!member || !Object.keys(member).length) {
      const errorMessage = `Member not found`;
      throw new NotFoundException(errorMessage);
    }

    return member;
  }

  async readAll(
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<Member[]> {
    const skip: number = Number(take * (page - 1));

    let members = [];

    try {
      members = await this.memberRepo.find({
        skip,
        take,
        relations: { welfare: true, account: { spouse: true, children: true } },
      });
    } catch (error) {
      members = [];
    }

    return members;
  }

  async readAllByWelfareId(
    welfareId: number,
    page: number,
    take: number,
    searchQueryParams: SearchQueryDto,
  ): Promise<Member[]> {
    const skip: number = Number(take * (page - 1));

    let members = [];

    try {
      members = await this.memberRepo.find({
        where: { welfare: { id: welfareId } },
        skip,
        take,
        relations: { welfare: true, account: { spouse: true, children: true } },
      });
    } catch (error) {
      members = [];
    }

    return members;
  }

  async update(id, payload: UpdateMemberDto): Promise<Member> {
    const member = await this.read(id);
    return this.upsert(member, payload);
  }

  async upsert(member: Member, payload: UpdateMemberDto): Promise<Member> {
    const { accountDto, spouseDto, childrenDto, memberDto, welfareDto } =
      payload;

    let account: Account, welfare: Welfare, spouse: Spouse, children: Child[];

    if (accountDto) {
      if (member.account) {
        account = await this.accountRepo.findOneBy({
          id: member?.id,
        });
      } else {
        account = new Account();
        account = await this.accountRepo.create(account);
      }

      if (welfareDto) {
        if (member.welfare?.id) {
          welfare = await this.welfareRepo.findOneBy({
            id: member.welfare?.id,
          });
        } else if (welfareDto.id) {
          welfare = await this.welfareRepo.findOneBy({
            id: welfareDto.id,
          });
        }
        member.welfare = welfare;
      }

      if (spouseDto) {
        if (member.account.spouse) {
          spouse = await this.spouseRepo.findOneBy({
            id: member.account.spouse?.id,
          });
        } else {
          spouse = new Spouse();
          spouse = await this.spouseRepo.create(spouse);
        }

        Object.assign(spouse, spouseDto);
        if (spouse) {
          spouse.spouse = member.account;
          await this.spouseRepo.save(spouse);
        }
      }

      if (childrenDto) {
        if (member.account.children.length) {
          children = member.account.children;
        } else {
          children = new Array<Child>(childrenDto.length).fill(new Child());
          children = await this.childRepo.create(children);
        }
        for (let index = 0; index < childrenDto.length; index++) {
          Object.assign(children[index], childrenDto[index]);
        }
        await this.childRepo.save(children);
      }

      Object.assign(account, accountDto);
      account.children = children;
      account.salt = await genSalt();
      account.password = await hash('Password@123', account.salt);
      delete account.password && delete account.salt;

      await this.accountRepo.save(account);

      Object.assign(member, memberDto);

      member.account = account;

      await this.memberRepo.save(member);
    }

    return member;
  }

  async drop(id): Promise<void> {
    const member: Member = await this.read(id);
    const result = await this.memberRepo.remove(member);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(member: Member): Promise<Member> {
    try {
      return await this.memberRepo.save(member);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Member Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
