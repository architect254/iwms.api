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
import { User } from './entities/user.entity';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { MembershipService } from '../membership/membership.service';
import { GroupService } from '../group/group.service';
import { Membership, MembershipStatus } from '../membership/membership.entity';
import { Group } from '../group/group.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Spouse)
    private spouseRepo: Repository<Spouse>,
    @InjectRepository(Child)
    private childRepo: Repository<Child>,
    @InjectRepository(Membership)
    private membershipRepo: Repository<Membership>,
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
  ) {}

  async create(payload: CreateUserDto, initiator: User): Promise<User> {
    const user = await this.userRepo.create(new User());

    return this.upsert(user, payload, initiator);
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }

  async read(id: number): Promise<User> {
    let user = null;

    user = await this.userRepo.findOne({
      where: { id },
      relations: { membership: true, spouse: true, children: true },
    });

    if (!user || !Object.keys(user).length) {
      const errorMessage = `User not found`;
      throw new NotFoundException(errorMessage);
    }

    return user;
  }

  async readAll(
    page: number,
    take: number,
    userSearchQueryParams,
  ): Promise<any[]> {
    const skip: number = Number(take * (page - 1));

    let users = [];

    try {
      users = await this.userRepo.find({
        skip,
        take,
        relations: { membership: true, spouse: true, children: true },
      });
    } catch (error) {
      users = [];
    }

    return users;
  }

  async update(id, payload: UpdateUserDto, initiator: User): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    return this.upsert(user, payload, initiator);
  }

  async upsert(
    user: User,
    payload: UpdateUserDto,
    initiator: User,
  ): Promise<User> {
    const { userDto, spouseDto, childrenDto, groupDto } = payload;

    let membership: Membership = null;
    let group: Group = null;
    let spouse: Spouse = null;
    let children: Child[] = [];

    Object.assign(user, userDto);

    if (groupDto && user.membership) {
      membership = await this.membershipRepo.findOneBy({
        id: user.membership?.id,
      });

      membership.status = MembershipStatus.INACTIVE;
      if (user.membership?.group) {
        group = await this.groupRepo.findOneBy({
          id: user.membership?.group?.id,
        });
      } else {
        group = new Group();
        group = await this.groupRepo.create(group);
      }
      Object.assign(group);
    } else {
      group = null;
    }
    membership.group = group;

    await this.membershipRepo.save(membership);

    user.membership = membership;

    if (spouseDto) {
      if (user.spouse) {
        spouse = await this.spouseRepo.findOneBy({ id: user.spouse?.id });
      } else {
        spouse = new Spouse();
        spouse = await this.spouseRepo.create(spouse);
      }
      Object.assign(spouse, spouseDto);
    } else {
      spouse = null;
    }
    await this.spouseRepo.save(spouse);

    user.spouse = spouse;

    if (childrenDto) {
      if (user.children) {
        children = await this.childRepo.findBy({ parent: user });
      } else {
        children = new Array<Child>(childrenDto.length);
        children = await this.childRepo.create(children);
      }
      for (let index = 0; index < childrenDto.length; index++) {
        Object.assign(children[index], childrenDto[index]);
      }
    } else {
      children = [];
    }
    await this.childRepo.save(children);

    user.children = children;

    await this.userRepo.save(user);

    delete user.password && delete user.salt;

    return user;
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
