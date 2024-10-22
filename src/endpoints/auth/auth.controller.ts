import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './auth.service';
import { Account } from '../account/entities/account.entity';
import { AuthService } from './auth.service';
import { SignInCredentialsDto } from './sign-in.dto';
import { SignUpCredentialsDto } from './sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    payload: SignUpCredentialsDto,
  ): Promise<Account> {
    return this.authService.signUp(payload);
  }

  @Post('/sign-in')
  async signIn(
    @Body()
    payload: SignInCredentialsDto,
  ): Promise<{ token: string }> {
    const account = await this.authService.signIn(payload);

    console.log('account user', account);
    const jwtPayload: JwtPayload = { account };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
