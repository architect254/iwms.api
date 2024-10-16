import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtPayload } from '../../endpoints/auth/auth.service';

import { Account } from '../../endpoints/account/entities/account.entity';

import * as config from 'config';

const JWT_CONFIG = config.get('db');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Account)
    private userRepo: Repository<Account>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || JWT_CONFIG.secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<Account> {
    const { email } = jwtPayload.account;
    const DB_USER = await this.userRepo.findOne({ where: { email } });

    if (!DB_USER) {
      throw new NotFoundException('account not found');
    }

    return DB_USER;
  }
}
