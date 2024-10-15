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

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: (origin, cb) => {
      console.log('ORIGIN', origin);
      if (origin?.includes('iwms.com')) {
        cb(null, 'iwms.com');
      } else {
        cb(null, 'https://iwms-5vlj.onrender.com/');
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT'],
  });

  await app.listen(PORT);

  logger.log(`listening on port:${PORT}`);
}
bootstrap();
