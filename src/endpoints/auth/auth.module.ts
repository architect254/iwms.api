import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { JwtStrategy } from '../../core/services/jwt.strategy';

import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

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
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [JwtService, JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [
    PassportModule,
    JwtModule,
    UserModule,
    JwtService,
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
