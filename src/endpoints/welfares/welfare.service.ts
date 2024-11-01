import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';

import { Welfare } from './welfare.entity';
import { WelfareDto } from './welfare.dto';
import { Child, Member, Membership, Spouse } from '../members/entities';

@Injectable()
export class WelfareService {
  constructor(
    @InjectRepository(Welfare)
    private welfareRepo: Repository<Welfare>,
  ) {}

  async create(payload: WelfareDto): Promise<Welfare> {
    return this.upsert(payload);
  }

  async read(id): Promise<Welfare> {
    let welfare = null;

    try {
      welfare = await this.welfareRepo.findOne({
        where: { id },
        relations: {
          chairperson: true,
          treasurer: true,
          secretary: true,
          members: true,
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

  async readMany(page: number, take: number): Promise<Welfare[]> {
    const skip: number = Number(take * (page - 1));

    let welfares: Welfare[];

    try {
      welfares = await this.welfareRepo.find({
        skip,
        take,
        relations: {
          chairperson: true,
          treasurer: true,
          secretary: true,
          members: true,
        },
      });
      return welfares;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, payload: WelfareDto): Promise<Welfare> {
    return this.upsert(payload, id);
  }

  async upsert(payload: Partial<WelfareDto>, id?: string): Promise<Welfare> {
    let welfare: Welfare,
      chairperson: Member,
      chairpersonSpouse: Spouse,
      chairpersonChildren: Child[],
      treasurer: Member,
      treasurerSpouse: Spouse,
      treasurerChildren: Child[],
      secretary: Member,
      secretarySpouse: Spouse,
      secretaryChildren: Child[];

    return this.welfareRepo.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        try {
          if (id) {
            welfare = await transactionEntityManager.findOneBy<Welfare>(
              Welfare,
              {
                id,
              },
            );
          } else {
            welfare = await transactionEntityManager.create(Welfare);
          }

          const { chairpersonDto, treasurerDto, secretaryDto } = payload;

          if (chairpersonDto) {
            if (welfare?.chairperson) {
              chairperson = welfare?.chairperson;
            } else {
              chairperson = new Member();
              chairperson = await transactionEntityManager.create(
                Member,
                chairperson,
              );
            }

            const { spouseDto, childrenDto } = chairpersonDto;

            if (spouseDto) {
              if (chairperson?.spouse) {
                chairpersonSpouse = chairperson?.spouse;
              } else {
                chairpersonSpouse = new Spouse();
                chairpersonSpouse = await transactionEntityManager.create(
                  Spouse,
                  chairpersonSpouse,
                );
              }

              Object.assign(chairpersonSpouse, spouseDto);

              chairperson.spouse =
                await transactionEntityManager.save(chairpersonSpouse);
            }

            if (childrenDto) {
              if (chairperson?.children?.length) {
                chairpersonChildren = chairperson?.children;
              } else {
                chairpersonChildren = new Array<Child>(childrenDto.length).fill(
                  new Child(),
                );
                chairpersonChildren = await transactionEntityManager.create(
                  Child,
                  chairpersonChildren,
                );
              }
              for (let index = 0; index < childrenDto.length; index++) {
                Object.assign(chairpersonChildren[index], childrenDto[index]);
              }

              chairperson.children =
                await transactionEntityManager.save(chairpersonChildren);
            }

            Object.assign(chairperson, chairpersonDto);
            chairperson.membership = Membership.Active;
            chairperson.salt = await genSalt();
            chairperson.password = await hash('Password@123', chairperson.salt);

            chairperson = await transactionEntityManager.save(chairperson);

            delete chairperson.password && delete chairperson.salt;
          }

          if (treasurerDto) {
            if (welfare?.treasurer) {
              treasurer = welfare?.treasurer;
            } else {
              treasurer = new Member();
              treasurer = await transactionEntityManager.create(
                Member,
                treasurer,
              );
            }

            const { spouseDto, childrenDto } = treasurerDto;

            if (spouseDto) {
              if (treasurer?.spouse) {
                treasurerSpouse = chairperson?.spouse;
              } else {
                treasurerSpouse = new Spouse();
                treasurerSpouse = await transactionEntityManager.create(
                  Spouse,
                  treasurerSpouse,
                );
              }

              Object.assign(treasurerSpouse, spouseDto);

              treasurer.spouse =
                await transactionEntityManager.save(treasurerSpouse);
            }

            if (childrenDto) {
              if (treasurer?.children?.length) {
                treasurerChildren = treasurer?.children;
              } else {
                treasurerChildren = new Array<Child>(childrenDto.length).fill(
                  new Child(),
                );
                treasurerChildren = await transactionEntityManager.create(
                  Child,
                  treasurerChildren,
                );
              }
              for (let index = 0; index < childrenDto.length; index++) {
                Object.assign(treasurerChildren[index], childrenDto[index]);
              }

              treasurer.children =
                await transactionEntityManager.save(treasurerChildren);
            }

            Object.assign(treasurer, treasurerDto);

            treasurer.membership = Membership.Active;

            treasurer.salt = await genSalt();
            treasurer.password = await hash('Password@123', treasurer.salt);

            treasurer = await transactionEntityManager.save(treasurer);

            delete treasurer.password && delete treasurer.salt;
          }

          if (secretaryDto) {
            if (welfare?.secretary) {
              secretary = welfare?.chairperson;
            } else {
              secretary = new Member();
              secretary = await transactionEntityManager.create(
                Member,
                secretary,
              );
            }

            const { spouseDto, childrenDto } = secretaryDto;

            if (spouseDto) {
              if (secretary?.spouse) {
                secretarySpouse = secretary?.spouse;
              } else {
                secretarySpouse = new Spouse();
                secretarySpouse = await transactionEntityManager.create(
                  Spouse,
                  secretarySpouse,
                );
              }

              Object.assign(secretarySpouse, spouseDto);

              secretary.spouse =
                await transactionEntityManager.save(secretarySpouse);
            }

            if (childrenDto) {
              if (secretary?.children?.length) {
                secretaryChildren = secretary?.children;
              } else {
                secretaryChildren = new Array<Child>(childrenDto.length).fill(
                  new Child(),
                );
                secretaryChildren = await transactionEntityManager.create(
                  Child,
                  secretaryChildren,
                );
              }
              for (let index = 0; index < childrenDto.length; index++) {
                Object.assign(secretaryChildren[index], childrenDto[index]);
              }

              secretary.children =
                await transactionEntityManager.save(secretaryChildren);
            }

            Object.assign(secretary, secretaryDto);

            secretary.membership = Membership.Active;

            secretary.salt = await genSalt();
            secretary.password = await hash('Password@123', secretary.salt);

            secretary = await transactionEntityManager.save(secretary);

            delete secretary.password && delete secretary.salt;
          }

          Object.assign(welfare, payload);

          welfare.chairperson = chairperson;
          welfare.treasurer = treasurer;
          welfare.secretary = secretary;

          welfare = await transactionEntityManager.save(welfare);
        } catch (error) {
          throw new Error(error);
        }
        return welfare;
      },
    );
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
