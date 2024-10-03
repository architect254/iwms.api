import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/user/user.entity';
import { JwtPayload } from './jwt.payload';

import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
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
