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

import { UserDto } from './user.dto';
import { MembershipService } from '../membership/membership.service';
import { GroupService } from '../group/group.service';
import { Membership, MembershipStatus } from '../membership/membership.entity';

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
    private groupService: GroupService,
  ) {}

  async create(payload: UserDto, initiator: User): Promise<User> {
    const { userDto, spouseDto, childrenDto } = payload;
    const { group_id } = userDto;

    delete userDto.group_id;

    let membership: Membership = null;
    let spouse: Spouse = null;
    let children: Child[] = [];

    let user = new User();

    Object.assign(user, userDto);

    user = await this.userRepo.create(user);

    if (group_id) {
      membership = new Membership();

      membership.status = MembershipStatus.INACTIVE;

      membership = await this.membershipRepo.create(membership);

      const group = await this.groupService.read(group_id);

      membership.group = group;

      await this.membershipRepo.save(membership);
    }

    if (!(spouseDto === undefined || spouseDto === null)) {
      spouse = new Spouse();

      Object.assign(spouse, spouseDto)

      spouse = await this.spouseRepo.create(spouse);

      spouse.spouse = user;

      await this.spouseRepo.save(spouse);
    }

    if (!(childrenDto === undefined || childrenDto === null)) {
      for (let index = 0; index < childrenDto.length; index++) {
        let child = new Child();

        Object.assign(child, childrenDto[index])

        child = await this.childRepo.create(child);

        child.parent = user;

        children.push(child);

        await this.childRepo.save(child);
      }
    }

    user.membership = membership;
    user.spouse = spouse;
    user.children = children;

    user.salt = await genSalt();
    user.password = await this.hashPassword('Password@123', user.salt);

    user = await this.userRepo.save(user);

    delete user.password && delete user.salt;

    return user;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }

  async read(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id =:id', { id })
      .leftJoinAndSelect('user.membership', 'membership')
      .leftJoinAndSelect('user.spouse', 'spouse')
      .leftJoinAndSelect('user.children', 'children')
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
