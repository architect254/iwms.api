import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtPayload } from '../../core/models/jwt.payload';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    payload: SignUpCredentialsDto,
  ): Promise<User> {
    return this.authService.signUp(payload);
  }

  @Post('/sign-in')
  async signIn(
    @Body()
    payload: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.authService.signIn(payload);
    if (!user) {
      throw new ConflictException('invalid user credentials');
    }
    delete user.password && delete user.salt;
    const jwtPayload: JwtPayload = { user };
    const accessToken = await this.jwtService.sign(jwtPayload);

    return { accessToken };
  }
}
