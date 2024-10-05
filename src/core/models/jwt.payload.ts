import { User } from "src/endpoints/user/user.entity";

export interface JwtPayload {
  user: User;
}
