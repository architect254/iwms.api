import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from './entities';

export const GetUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const account = req.account;
    return key ? account[key] : account;
  },
);
