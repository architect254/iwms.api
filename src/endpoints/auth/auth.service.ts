import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { compare, hash, genSalt } from 'bcrypt';

import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';
import { Member, Membership } from '../members/entities';
import { Admin } from '../admins/entities/admin.entity';
import { MembersService } from '../members/members.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    private membersService: MembersService,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<Admin> {
    // const persisted_users = await this.userService.readAll(1, 1);
    // if (persisted_users.length) {
    //   throw new UnauthorizedException(
    //     'kindly contact your Welfare Manager to add you',
    //   );
    // }
    const { password } = credentials;

    const admin = new Admin();
    Object.assign(admin, credentials);

    admin.salt = await genSalt();
    admin.password = await this.hashPassword(password, admin.salt);

    try {
      return await this.adminRepo.save(admin);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(
          'User with same credentials already exists in our database',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(credentials: SignInCredentialsDto) {
    const { id_number, password } = credentials;
    let user;

    user = await this.memberRepo
      .findOne({
        where: { id_number },
      })
      .then((user) => {
        return this.membersService.read(user.id);
      });

      if (
        user.membership == Membership.Deactivated ||
        user.membership == Membership.Deceased
      ) {
        throw new UnauthorizedException('This user account has been deactivated');
      }

    if (!user) {
      user = await this.adminRepo.findOne({ where: { id_number } });
      if (!user) {
        throw new NotFoundException('This user account does not exist');
      }
    }


    const isValid = await compare(password, user?.password);

    if (!isValid) {
      throw new ConflictException('Invalid user account credentials');
    }

    delete user.password && delete user.salt;

    return user;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }
}
export interface JwtPayload {
  user: Member | Admin;
}
