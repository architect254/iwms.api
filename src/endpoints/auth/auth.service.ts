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

import { Account, Class } from '../account/entities/account.entity';

import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<Account> {
    // const persisted_users = await this.userService.readAll(1, 1);
    // if (persisted_users.length) {
    //   throw new UnauthorizedException(
    //     'kindly contact your Welfare Manager to add you',
    //   );
    // }
    const { password } = credentials;

    const account = new Account();
    Object.assign(account, credentials);

    account.class = Class.Admin;

    account.salt = await genSalt();
    account.password = await this.hashPassword(password, account.salt);

    try {
      return await this.accountRepo.save(account);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(
          'Account with same credentials already exists',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(credentials: SignInCredentialsDto) {
    const { email, password } = credentials;
    const account = await this.accountRepo.findOne({
      where: { email },
      relations: { membership: { welfare: true } },
    });

    if (!account) {
      throw new NotFoundException(
        'This account does not exist in our database',
      );
    }
    const isValid = await compare(password, account?.password);

    if (!isValid) {
      throw new ConflictException('Invalid account credentials');
    }

    delete account.password && delete account.salt;

    return account;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }
}
export interface JwtPayload {
  account: Account;
}
