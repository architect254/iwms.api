import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Account } from './entities/account.entity';

export const GetAccount = createParamDecorator(
  (key: string, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    const account = req.account;
    return key ? account[key] : account;
  },
);
