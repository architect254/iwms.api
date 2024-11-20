import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Page } from '.';
import { Welfare } from 'src/endpoints/welfares/welfare.entity';

export enum ConfigType {
  Main = 'Main',
  NonMain = 'NonMain',
}

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ConfigType,
    default: ConfigType[ConfigType.Main],
  })
  type: ConfigType;

  @Column({ default: 'iwms-5vlj.onrender.com', unique: true })
  @Index()
  host: string;

  @OneToMany(() => Welfare, (welfare) => welfare.config, { nullable: true })
  welfare: Welfare[];

  @OneToOne(() => Page, (page) => page.config)
  @JoinColumn()
  page: Page;

  @CreateDateColumn()
  create_date?: Date;

  @UpdateDateColumn()
  update_date?: Date;
}
