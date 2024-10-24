import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAccount } from './entities/user_account.entity';


export const GetUserAccount = createParamDecorator(
  (key: string, ctx: ExecutionContext): UserAccount => {
    const req = ctx.switchToHttp().getRequest();
    const account = req.account;
    return key ? account[key] : account;
  },
);
