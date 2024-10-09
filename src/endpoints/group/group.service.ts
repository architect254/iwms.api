import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Group } from './group.entity';
import { GroupDto } from './group.dto';
import { User } from 'src/endpoints/user/entities/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
  ) {}

  async create(payload: GroupDto, initiator: User): Promise<Group> {
    const group = new Group();

    Object.assign(group, payload);

    return await this.save(group);
  }

  async read(id): Promise<Group> {
    const group = await this.groupRepo
      .createQueryBuilder('group')
      .where('group.id =:id', { id })
      .leftJoinAndSelect('group.createdBy', 'createdBy')
      .leftJoinAndSelect('group.updatedBy', 'updatedBy')
      .getOne();

    if (!group || !Object.keys(group).length) {
      return null;
    }

    return group;
  }

  async readAll(page: number, take: number): Promise<Group[]> {
    const skip: number = take * (page - 1);

    return await this.groupRepo.find({ skip, take });
  }

  async update(id, payload: GroupDto, initiator: User): Promise<Group> {
    const group: Group = await this.read(id);

    Object.assign(group, payload);

    return await this.groupRepo.save(group);
  }

  async drop(id): Promise<void> {
    const group: Group = await this.read(id);
    const result = await this.groupRepo.remove(group);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(group: Group): Promise<Group> {
    try {
      return await this.groupRepo.save(group);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Group Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
