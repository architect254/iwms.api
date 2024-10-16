import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../../core/services/jwt.strategy';

import { AccountModule } from '../account/account.module';
import { Account } from '../account/entities/account.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import * as config from 'config';

const JWT_CONFIG = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || JWT_CONFIG.secret,
      signOptions: {
        expiresIn: JWT_CONFIG.expiresIn,
      },
    }),
    AccountModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService, AccountModule, JwtModule, PassportModule],
})
export class AuthModule {}
