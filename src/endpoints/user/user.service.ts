import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Child } from './entities/child.entity';
import { Spouse } from './entities/spouse.entity';
import { User } from './entities/user.entity';

import { UserDto } from './user.dto';
import { MembershipService } from '../membership/membership.service';
import { GroupService } from '../group/group.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Spouse)
    private spouseRepo: Repository<Spouse>,
    @InjectRepository(Child)
    private childRepo: Repository<Child>,
    private membershipService: MembershipService,
    private groupService: GroupService,
  ) {}

  async create(payload: UserDto, initiator: User): Promise<User> {
    let user = new User();
    let spouse = null;
    let children = [];

    Object.assign(user, payload);

    user = await this.save(user);

    const membership = await this.membershipService.create(
      { status: 'Inactive' },
      initiator,
    );

    if (payload.user.group_id) {
      const group = await this.groupService.read(payload.user.group_id);
      membership.group = group;
      user.membership = membership;
    }

    if (Object.keys(payload.spouse).length) {
      spouse = await this.spouseRepo.create(payload.spouse);
      user.spouse = spouse;
    }

    if (payload.children.length) {
      for (let index = 0; index < payload.children.length; index++) {
        const child = await this.childRepo.create(payload.children[index]);
        children.push(child);
      }
      user.children = children;
    }

    return user;
  }

  async read(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id =:id', { id })
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy')
      .getOne();

    if (!user || !Object.keys(user).length) {
      const errorMessage = `User Not Found`;
      throw new NotFoundException(errorMessage);
    }

    return user;
  }

  async readAll(page: number, take: number): Promise<User[]> {
    const skip: number = Number(take * (page - 1));

    let users = [];

    try {
      users = await this.userRepo.find({ skip, take });
    } catch (error) {
      users = [];
    }

    return users;
  }

  async update(id, payload: UserDto, initiator: User): Promise<User> {
    const user: User = await this.read(id);

    Object.assign(user, payload);

    return await this.userRepo.save(user);
  }

  async drop(id): Promise<void> {
    const user: User = await this.read(id);
    const result = await this.userRepo.remove(user);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(user: User): Promise<User> {
    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('User Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
