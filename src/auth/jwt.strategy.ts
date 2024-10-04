import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { JwtPayload } from './jwt.payload';

import * as config from 'config';

const JWT_CONFIG = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || JWT_CONFIG.secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const { email } = jwtPayload.user;
    const DB_USER = await this.userRepo.findOne({ where: { email } });

    if (!DB_USER) {
      throw new UnauthorizedException('Invalid User Credentials');
    }

    return DB_USER;
  }
}
