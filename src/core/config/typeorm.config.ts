import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as config from 'config';

const DB_CONFIG = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: DB_CONFIG.type,
  host: process.env.RHS_HOSTNAME || DB_CONFIG.host,
  port: process.env.RHS_PORT || DB_CONFIG.port,
  username: process.env.RHS_USERNAME || DB_CONFIG.username,
  password: process.env.RHS_PASSWORD || DB_CONFIG.password,
  database: process.env.RHS_DB_NAME || DB_CONFIG.database,
  synchronize: process.env.TYPEORM_SYNC || DB_CONFIG.synchronize,
  entities: [__dirname + '../../../**/*.entity.{ts,js}'],
};
