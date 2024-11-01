import { User } from 'src/core/models/entities/user.entity';
import { Column, Entity } from 'typeorm';

@Entity('admins')
export class Admin extends User {
  @Column({ default: true })
  isAdmin: true;
  constructor() {
    super();
  }
}
