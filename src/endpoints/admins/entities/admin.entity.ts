import { User } from 'src/core/models/entities/user.entity';
import { Entity } from 'typeorm';

@Entity('admins')
export class Admin extends User {
  constructor() {
    super();
  }
}
