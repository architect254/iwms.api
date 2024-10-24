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

import {
  AccountType,
  AdminUserAccount,
} from '../account/entities/user_account.entity';

import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUserAccount)
    private accountRepo: Repository<AdminUserAccount>,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<AdminUserAccount> {
    // const persisted_users = await this.userService.readAll(1, 1);
    // if (persisted_users.length) {
    //   throw new UnauthorizedException(
    //     'kindly contact your Welfare Manager to add you',
    //   );
    // }
    const { password } = credentials;

    const account = new AdminUserAccount();
    Object.assign(account, credentials);

    account.type = AccountType.Admin;

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
    const account: AdminUserAccount = await this.accountRepo.findOne({
      where: { id_number },
    });

    if (!account) {
      throw new NotFoundException('This user account does not exist');
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
  account: AdminUserAccount;
}
