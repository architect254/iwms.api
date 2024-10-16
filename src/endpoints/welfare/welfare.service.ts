import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Welfare } from './welfare.entity';
import { WelfareDto } from './welfare.dto';
import { Account } from 'src/endpoints/account/entities/account.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class WelfareService {
  constructor(
    @InjectRepository(Welfare)
    private welfareRepo: Repository<Welfare>,
  ) {}

  async create(payload: WelfareDto): Promise<Welfare> {
    const welfare = new Welfare();

    Object.assign(welfare, payload);

    return await this.save(welfare);
  }

  async read(id): Promise<Welfare> {
    let welfare = null;

    try {
      welfare = await this.welfareRepo.findOne({
        where: { id },
        relations: {
          members: {
            account: true,
          },
        },
      });
    } catch (error) {
      welfare = null;
    }
    
    if (!welfare || !Object.keys(welfare).length) {
      const errorMessage = `Welfare Group not found`;
      throw new NotFoundException(errorMessage);
    }

    return welfare;
  }

  async readAll(page: number, take: number): Promise<Welfare[]> {
    const skip: number = Number(take * (page - 1));

    let welfares = [];

    try {
      welfares = await this.welfareRepo.find({
        skip,
        take,
        relations: {
          members: {
            account: true,
          },
        },
      });
    } catch (error) {
      welfares = [];
    }

    return welfares;
  }

  async update(id, payload: WelfareDto): Promise<Welfare> {
    const welfare: Welfare = await this.read(id);

    Object.assign(welfare, payload);

    return await this.welfareRepo.save(welfare);
  }

  async drop(id): Promise<void> {
    const welfare: Welfare = await this.read(id);
    const result = await this.welfareRepo.remove(welfare);

    if (!result) {
      const errorMessage = `Operation Failed:DELETE`;
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async save(welfare: Welfare): Promise<Welfare> {
    try {
      return await this.welfareRepo.save(welfare);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Welfare Exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
