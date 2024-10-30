import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { hash,genSalt } from 'crypto';
import { hash, genSalt } from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';

import { Admin } from './entities/admin.entity';
import { AdminDto, SearchQueryDto } from './dtos/admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  async create(payload: AdminDto): Promise<Admin> {
    return this.upsert(payload);
  }

  async read(id: string): Promise<Admin> {
    let admin: Admin = null;

    try {
      admin = await this.adminRepo.findOneBy({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }

    return admin;
  }

  async readMany(
    page: number = 1,
    take: number = 100,
    searchQueryParams?: SearchQueryDto,
  ): Promise<Admin[]> {
    const skip: number = Number(take * (page - 1));
    let admins: Admin[];
    try {
      admins = await this.adminRepo.find({
        skip,
        take,
      });
    } catch (error) {
      throw new Error(error);
    }
    return admins;
  }

  async update(id, payload: Partial<AdminDto>): Promise<Admin> {
    return this.upsert(payload, id);
  }

  async upsert(payload: Partial<AdminDto>, id?: string): Promise<Admin> {
    let admin: Admin;

    return this.adminRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        try {
          async function getAdmin(id: string, admin: Admin): Promise<Admin> {
            if (id) {
              return await transactionEntityManager.findOneBy(Admin, { id });
            } else {
              return await transactionEntityManager.create(Admin);
            }
          }

          admin = await getAdmin(id, new Admin());

          /**
           *
           * Assigns payload data to UserAccount Object
           *
           */
          Object.assign(admin, payload);

          admin.salt = await genSalt();
          admin.password = await hash('Password@123', admin.salt);

          admin = await transactionEntityManager.save(admin);

          delete admin.password && delete admin.salt;
        } catch (error) {
          throw new Error(error);
        }
        return admin;
      },
    );
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
