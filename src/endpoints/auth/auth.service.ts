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
import { UserMembershipService } from '../account/user-membership.service';
import {
  ActiveMember,
  Admin,
  BereavedMember,
  DeactivatedMember,
  DeceasedMember,
  Membership,
  User,
} from '../account/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private accountRepo: Repository<User>,
    private userMembershipService: UserMembershipService,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<Admin> {
    // const persisted_users = await this.userService.readAll(1, 1);
    // if (persisted_users.length) {
    //   throw new UnauthorizedException(
    //     'kindly contact your Welfare Manager to add you',
    //   );
    // }
    const { password } = credentials;

    const account = new Admin();
    Object.assign(account, credentials);

    account.membership = Membership.Admin;

    account.salt = await genSalt();
    account.password = await this.hashPassword(password, account.salt);

    try {
      return await this.accountRepo.save(account);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(
          'User account with same credentials already exists',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(credentials: SignInCredentialsDto) {
    const { id_number, password } = credentials;
    const account:
      | Admin
      | ActiveMember
      | BereavedMember
      | DeceasedMember
      | DeactivatedMember = await this.accountRepo
      .findOne({
        where: { id_number },
      })
      .then((account) => {
        return this.userMembershipService.read(account.id);
      });

    if (!account) {
      throw new NotFoundException('This user account does not exist');
    }
    if (
      account.membership == Membership.Deactivated ||
      account.membership == Membership.Deceased
    ) {
      throw new UnauthorizedException('This user account has been deactivated');
    }

    const isValid = await compare(password, account?.password);

    if (!isValid) {
      throw new ConflictException('Invalid user account credentials');
    }

    delete account.password && delete account.salt;

    return account;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }
}
export interface JwtPayload {
  account: Admin | ActiveMember | BereavedMember;
}
