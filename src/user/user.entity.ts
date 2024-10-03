import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';

import { AbstractEntity } from 'src/core/base-entity';

@Entity('users')
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;
}
