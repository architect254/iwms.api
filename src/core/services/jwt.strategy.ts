import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtPayload } from '../../endpoints/auth/auth.service';

import {
  UserAccount,
} from '../../endpoints/account/entities/user_account.entity';

import * as config from 'config';

const JWT_CONFIG = config.get('db');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserAccount)
    private accountRepo: Repository<UserAccount>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || JWT_CONFIG.secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<UserAccount> {
    const { id_number } = jwtPayload.account;
    const DB_USER = await this.accountRepo.findOne({ where: { id_number } });

    if (!DB_USER) {
      throw new NotFoundException('account not found');
    }

    return DB_USER;
  }
}
