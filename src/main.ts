import { AppModule } from './app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
  BadRequestException,
  ValidationError,
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
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   const getPrettyClassValidatorErrors = (
      //     validationErrors: ValidationError[],
      //     parentProperty = '',
      //   ): Array<{ property: string; errors: string[] }> => {
      //     const errors = [];

      //     const getValidationErrorsRecursively = (
      //       validationErrors: ValidationError[],
      //       parentProperty = '',
      //     ) => {
      //       for (const error of validationErrors) {
      //         const propertyPath = parentProperty
      //           ? `${parentProperty}.${error.property}`
      //           : error.property;

      //         if (error.constraints) {
      //           errors.push({
      //             property: propertyPath,
      //             errors: Object.values(error.constraints),
      //           });
      //         }

      //         if (error.children?.length) {
      //           getValidationErrorsRecursively(error.children, propertyPath);
      //         }
      //       }
      //     };

      //     getValidationErrorsRecursively(validationErrors, parentProperty);

      //     return errors;
      //   };

      //   const errors = getPrettyClassValidatorErrors(validationErrors);

      //   return new BadRequestException({
      //     message: 'validation error',
      //     errors: errors,
      //   });
      // },
    }),
  );

  app.enableCors({
    origin: (origin, cb) => {
      console.log('ORIGIN', origin);
      if (origin?.includes('iwms.com')) {
        cb(null, 'iwms.com');
      } else {
        cb(null, origin);
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
