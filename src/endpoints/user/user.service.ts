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
import { Membership, MembershipStatus } from '../membership/membership.entity';
import { Welfare } from '../welfare/welfare.entity';

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
    @InjectRepository(Welfare)
    private welfareRepo: Repository<Welfare>,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const user = await this.userRepo.create(new User());

    return this.upsert(user, payload);
  }

  async read(id: number): Promise<User> {
    let user = null;

    user = await this.userRepo
      .findOne({
        where: { id },
        relations: { membership: true, spouse: true, children: true },
      })
      .then(async (user) => {
        if (user.membership) {
          const welfare = await this.welfareRepo.findOneBy({
            id: user.membership?.welfare?.id,
          });
          user.membership.welfare = welfare;
        }
        return user;
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

  async update(id, payload: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    return this.upsert(user, payload);
  }

  async upsert(user: User, payload: UpdateUserDto): Promise<User> {
    const { userDto, membershipDto, spouseDto, childrenDto, welfareDto } =
      payload;

    let membership: Membership,
      welfare: Welfare,
      spouse: Spouse,
      children: Child[];

    Object.assign(user, userDto);

    if (membershipDto) {
      if (user.membership) {
        membership = await this.membershipRepo.findOneBy({
          id: user.membership?.id,
        });
      } else {
        membership = new Membership();
        membership.status = MembershipStatus.INACTIVE;
        membership = await this.membershipRepo.create(membership);
      }

      Object.assign(membership, membershipDto);

      await this.membershipRepo.save(membership);

      if (welfareDto) {
        if (user.membership?.welfare) {
          welfare = await this.welfareRepo.findOneBy({
            id: user.membership?.welfare?.id,
          });
        } else {
          welfare = new Welfare();
          welfare.memberships = [];
          welfare = await this.welfareRepo.create(welfare);
        }

        Object.assign(welfare, welfareDto);

        await this.welfareRepo.save(welfare);
      }
      membership.welfare = welfare;

      if (spouseDto) {
        if (user.spouse) {
          spouse = await this.spouseRepo.findOneBy({ id: user.spouse?.id });
        } else {
          spouse = new Spouse();
          spouse = await this.spouseRepo.create(spouse);
        }

        Object.assign(spouse, spouseDto);

        await this.spouseRepo.save(spouse);
      }

      if (childrenDto) {
        if (user.children) {
          children = await this.childRepo.findBy({ parent: user });
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

    user.membership = membership;
    user.spouse = spouse;
    user.children = children;
    user.salt = await genSalt();
    user.password = await hash('Password@123', user.salt);

    await this.userRepo.save(user);

    delete user.password && delete user.salt;

    return user;
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

  async drop(id): Promise<void> {
    const user: User = await this.read(id);
    const result = await this.userRepo.remove(user);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
