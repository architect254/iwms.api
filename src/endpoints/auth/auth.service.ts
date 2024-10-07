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

import { User, UserRole } from '../user/entities/user.entity';

import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private userService: UserService,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<User> {
    // const persisted_users = await this.userService.readAll(1, 1);
    // if (persisted_users.length) {
    //   throw new UnauthorizedException(
    //     'kindly contact your Welfare Manager to add you',
    //   );
    // }
    const { password } = credentials;

    const user = new User();
    Object.assign(user, credentials);

    user.role = UserRole.SITE_ADMIN;

    user.membership = null;
    user.spouse = null;
    user.children = null;

    user.salt = await genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(
          'user with same credentials already exists',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(credentials: SignInCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.userRepo.findOne({ where: { email } });

    const isValid = await compare(password, user?.password);

    if (!user || !isValid) {
      throw new ConflictException('invalid user credentials');
    }
    return user;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }
}
