import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtPayload } from '../../endpoints/auth/auth.service';

import * as config from 'config';
import { User } from 'src/endpoints/users/entities/user/user.entity';

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
    const { id_number } = jwtPayload.user;
    const DB_USER = await this.userRepo.findOne({ where: { id_number } });

    if (!DB_USER) {
      throw new NotFoundException('User not found');
    }

    return DB_USER;
  }
}
