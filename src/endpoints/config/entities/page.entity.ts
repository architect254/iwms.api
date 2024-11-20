import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Config } from '.';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  page_name: string;

  @Column({default:'This is IWMS Main Home Content'})
  home_content: string;

  // @Column()
  // about_us_content: string;

  @OneToOne(() => Config, (config) => config.page)
  config: Config;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}
