import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Config } from './entities';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepo: Repository<Config>,
  ) {}

  async read(host: string): Promise<Config> {
    return await this.configRepo.findOne({
      where: { host },
      relations: { page: true },
    });
  }

  async drop(id): Promise<void> {
    //   const account: AdminUserAccount | ClientUserAccount = await this.read(id);
    //   const result = await this.userAccountRepo.remove(account);
    //   if (!result) {
    //     const errorMessage = `Operation Failed:DELETE`;
    //     throw new InternalServerErrorException(errorMessage);
    //   }
    // }
  }
}
