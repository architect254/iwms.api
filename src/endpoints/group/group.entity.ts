import { Entity, Column } from 'typeorm';

import { AbstractEntity } from '../../core/models/base-entity';

@Entity('groups')
export class Group extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  logoImage?: string;
}
