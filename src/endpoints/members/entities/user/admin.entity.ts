import { ChildEntity } from 'typeorm';

import { Membership, User } from '..';

@ChildEntity(Membership.Admin)
export class Admin extends User {
  constructor() {
    super();
  }
}
