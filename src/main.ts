import { AppModule } from './app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import * as config from 'config';

async function bootstrap() {
  const logger: Logger = new Logger('Bootstrap');
  const serverConfig = config.get('server');
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || serverConfig.port;

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  await app.listen(PORT);

  logger.log(`listening on port:${PORT}`);
}
bootstrap();
