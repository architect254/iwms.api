import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtPayload } from '../../core/models/jwt.payload';

import { User } from '../../endpoints/user/user.entity';

import * as config from 'config';

const JWT_CONFIG = config.get('db');

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
      throw new NotFoundException('user not found');
    }

    return DB_USER;
  }
}
