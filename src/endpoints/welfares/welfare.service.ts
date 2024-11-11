import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, ILike, Repository } from 'typeorm';
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

    welfare = await this.welfareRepo.findOne({
      where: { id },
      relations: {
        chairperson: true,
        treasurer: true,
        secretary: true,
        members: true,
      },
    });

    if (!welfare || !Object.keys(welfare).length) {
      const errorMessage = `Welfare Group not found`;
      throw new NotFoundException(errorMessage);
    }

    return welfare;
  }

  async readMany(page: number, take: number): Promise<Welfare[]> {
    const skip: number = Number(take * (page - 1));

    let welfares: Welfare[];

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
  }

  async search(page: number = 1, take: number = 100, name: string) {
    const skip: number = Number(take * (page - 1));
    let welfares;

    welfares = await this.welfareRepo
      .find({
        skip,
        take,
        where: { name: ILike(`%${name}%`) },
      })
      .then((welfares) => {
        return welfares.map((welfare) => {
          const { id, name } = welfare;
          return { id, name };
        });
      });

    return welfares;
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
        if (id) {
          welfare = await transactionEntityManager.findOne<Welfare>(Welfare, {
            where: { id },
            relations: {
              chairperson: { spouse: true, children: true },
              treasurer: { spouse: true, children: true },
              secretary: { spouse: true, children: true },
            },
          });
        } else {
          welfare = await transactionEntityManager.create(Welfare);
        }

        const { chairpersonDto, treasurerDto, secretaryDto } = payload;

        if (chairpersonDto) {
          if (welfare?.chairperson) {
            chairperson = welfare?.chairperson;
          } else {
            chairperson = new Member();
          }

          Object.assign(chairperson, chairpersonDto);

          const { spouseDto, childrenDto } = chairpersonDto;

          if (spouseDto) {
            if (chairperson?.spouse) {
              chairpersonSpouse = chairperson?.spouse;
            } else {
              chairpersonSpouse = new Spouse();
            }

            Object.assign(chairpersonSpouse, spouseDto);

            chairperson.spouse = chairpersonSpouse;
          }

          if (childrenDto) {
            if (chairperson?.children?.length) {
              chairpersonChildren = chairperson?.children;
            } else {
              chairpersonChildren = new Array<Child>(childrenDto.length).fill(
                new Child(),
              );
            }
            console.log(
              'looping',
              chairpersonChildren.length,
              childrenDto.length,
              chairpersonChildren,
              childrenDto,
            );
            for (let index = 0; index < childrenDto.length; index++) {
              console.log(
                'childloop',
                chairpersonChildren[index],
                childrenDto[index],
              );
              Object.assign(chairpersonChildren[index], childrenDto[index]);
            }

            chairperson.children = chairpersonChildren;
          }

          chairperson.membership = Membership.Active;
          chairperson.salt = await genSalt();
          chairperson.password = await hash('Password@123', chairperson.salt);

          chairperson.welfare = welfare;
          chairperson = await transactionEntityManager.save(chairperson);
          delete chairperson.welfare;
          delete chairperson.password && delete chairperson.salt;
        }

        if (treasurerDto) {
          if (welfare?.treasurer) {
            treasurer = welfare?.treasurer;
          } else {
            treasurer = new Member();
          }

          Object.assign(treasurer, treasurerDto);

          const { spouseDto, childrenDto } = treasurerDto;

          if (spouseDto) {
            if (treasurer?.spouse) {
              treasurerSpouse = treasurer?.spouse;
            } else {
              treasurerSpouse = new Spouse();
            }

            Object.assign(treasurerSpouse, spouseDto);

            treasurer.spouse = treasurerSpouse;
          }

          if (childrenDto) {
            if (treasurer?.children?.length) {
              treasurerChildren = treasurer?.children;
            } else {
              treasurerChildren = new Array<Child>(childrenDto.length).fill(
                new Child(),
              );
            }
            console.log(
              'looping',
              treasurerChildren.length,
              childrenDto.length,
              treasurerChildren,
              childrenDto,
            );
            for (let index = 0; index < childrenDto.length; index++) {
              console.log(
                'childloop',
                treasurerChildren[index],
                childrenDto[index],
              );
              Object.assign(treasurerChildren[index], childrenDto[index]);
            }

            treasurer.children = treasurerChildren;
          }

          treasurer.membership = Membership.Active;
          treasurer.salt = await genSalt();
          treasurer.password = await hash('Password@123', treasurer.salt);

          treasurer.welfare = welfare;
          treasurer = await transactionEntityManager.save(treasurer);
          delete treasurer.welfare;
          delete treasurer.password && delete treasurer.salt;
        }

        if (secretaryDto) {
          if (welfare?.secretary) {
            secretary = welfare?.secretary;
          } else {
            secretary = new Member();
          }

          Object.assign(secretary, secretaryDto);

          const { spouseDto, childrenDto } = secretaryDto;

          if (spouseDto) {
            if (secretary?.spouse) {
              secretarySpouse = secretary?.spouse;
            } else {
              secretarySpouse = new Spouse();
            }

            Object.assign(secretarySpouse, spouseDto);

            secretary.spouse = secretarySpouse;
          }

          if (childrenDto) {
            if (secretary?.children?.length) {
              secretaryChildren = secretary?.children;
            } else {
              secretaryChildren = new Array<Child>(childrenDto.length).fill(
                new Child(),
              );
            }
            console.log(
              'looping',
              secretaryChildren.length,
              childrenDto.length,
              secretaryChildren,
              childrenDto,
            );
            for (let index = 0; index < childrenDto.length; index++) {
              console.log(
                'childloop',
                secretaryChildren[index],
                childrenDto[index],
              );
              Object.assign(secretaryChildren[index], childrenDto[index]);
            }

            secretary.children = secretaryChildren;
          }

          secretary.membership = Membership.Active;
          secretary.salt = await genSalt();
          secretary.password = await hash('Password@123', secretary.salt);

          secretary.welfare = welfare;
          secretary = await transactionEntityManager.save(secretary);
          delete secretary.welfare;
          delete secretary.password && delete secretary.salt;
        }

        Object.assign(welfare, payload);

        welfare.chairperson = chairperson;
        welfare.treasurer = treasurer;
        welfare.secretary = secretary;

        welfare = await transactionEntityManager.save(welfare);
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
