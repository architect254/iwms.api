import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtPayload } from '../../endpoints/auth/auth.service';

import * as config from 'config';
import { Member } from 'src/endpoints/members/entities';
import { Admin } from 'src/endpoints/admins/entities/admin.entity';

const JWT_CONFIG = config.get('db');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || JWT_CONFIG.secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<Member | Admin> {
    const { user } = jwtPayload;
    const { id_number } = user;

    let DB_USER: Member | Admin;

    if (user instanceof Member) {
      DB_USER = await this.memberRepo.findOne({ where: { id_number } });
    } else {
      DB_USER = await this.adminRepo.findOne({ where: { id_number } });
    }

    if (!DB_USER) {
      throw new NotFoundException('User not found');
    }
    return DB_USER;
  }
}
