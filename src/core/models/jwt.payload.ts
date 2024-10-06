import { User } from "src/endpoints/user/entities/user.entity";

export interface JwtPayload {
  user: User;
}
