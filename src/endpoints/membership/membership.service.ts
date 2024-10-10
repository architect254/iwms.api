import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Membership } from './membership.entity';
import { MembershipDto } from './membership.dto';

import { User } from '../user/entities/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,
  ) {}

  async create(payload: MembershipDto): Promise<Membership> {
    const membership = new Membership();

    Object.assign(membership, payload);

    return await this.save(membership);
  }

  async read(id): Promise<Membership> {
    let membership = null;

    membership = await this.membershipRepo.findOne({
      where: { id },
      relations: { welfare: true },
    });

    if (!membership || !Object.keys(membership).length) {
      const errorMessage = `Membership not found`;
      throw new NotFoundException(errorMessage);
    }

    return membership;
  }

  async readAll(page: number, take: number): Promise<Membership[]> {
    const skip: number = Number(take * (page - 1));

    let memberships = [];

    try {
      memberships = await this.membershipRepo.find({
        skip,
        take,
        relations: { welfare: true },
      });
    } catch (error) {
      memberships = [];
    }

    return memberships;
  }

  async update(id, payload: MembershipDto): Promise<Membership> {
    const membership: Membership = await this.read(id);

    Object.assign(membership, payload);

    return await this.membershipRepo.save(membership);
  }

  async drop(id): Promise<void> {
    const membership: Membership = await this.read(id);
    const result = await this.membershipRepo.remove(membership);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(membership: Membership): Promise<Membership> {
    try {
      return await this.membershipRepo.save(membership);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Membership Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
