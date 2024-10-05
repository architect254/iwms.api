import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { compare, hash, genSalt } from 'bcrypt';

import { User, UserRole } from '../user/user.entity';

import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async signUp(credentials: SignUpCredentialsDto): Promise<User> {
    const { password } = credentials;

    const user = new User();
    Object.assign(user, credentials);

    user.role = UserRole.CLIENT;
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

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new ConflictException('invalid user credentials');
    }
    return user;
  }

  async hashPassword(input: string, salt: string): Promise<string> {
    return hash(input, salt);
  }
}
