import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserDto } from './user.dto';

import { GroupService } from '../group/group.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private groupService: GroupService,
  ) {}

  async create(payload: UserDto, initiator: User): Promise<User> {
    const { groupId } = payload;

    const user = new User();

    Object.assign(user, payload);

    const group = await this.groupService.read(groupId);

    user.group = group;

    user.creator = initiator;
    user.updator = initiator;

    return await this.save(user);
  }

  async read(id): Promise<User> {
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
    const { groupId } = payload;

    const user: User = await this.read(id);

    Object.assign(user, payload);

    const group = await this.groupService.read(groupId);

    user.group = group;
    user.updator = initiator;

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
