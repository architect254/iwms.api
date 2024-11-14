import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../../core/services/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { AdminsModule } from '../admins/admins.module';

import * as config from 'config';
import { WelfareModule } from '../welfares/welfare.module';

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
    AdminsModule,
    WelfareModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [
    AdminsModule,
    WelfareModule,
    JwtModule,
    PassportModule,
    AuthService,
  ],
})
export class AuthModule {}
