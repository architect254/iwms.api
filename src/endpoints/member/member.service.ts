import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Member } from './member.entity';
import { MemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  async create(payload: MemberDto): Promise<Member> {
    const member = new Member();

    Object.assign(member, payload);

    return await this.save(member);
  }

  async read(id): Promise<Member> {
    let member = null;

    member = await this.memberRepo.findOne({
      where: { id },
      relations: { welfare: true, account: true },
    });

    if (!member || !Object.keys(member).length) {
      const errorMessage = `Member not found`;
      throw new NotFoundException(errorMessage);
    }

    return member;
  }

  async readAll(page: number, take: number): Promise<Member[]> {
    const skip: number = Number(take * (page - 1));

    let members = [];

    try {
      members = await this.memberRepo.find({
        skip,
        take,
        relations: { welfare: true, account: true },
      });
    } catch (error) {
      members = [];
    }

    return members;
  }

  async update(id, payload: MemberDto): Promise<Member> {
    const member: Member = await this.read(id);

    Object.assign(member, payload);

    return await this.memberRepo.save(member);
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
