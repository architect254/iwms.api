import { User } from '../user/user.entity';
export interface JwtPayload {
  user: User;
}
