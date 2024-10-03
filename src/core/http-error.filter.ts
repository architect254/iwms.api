import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getResponse()['statusCode'];

    const errorResponse = {
      status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      error: exception.getResponse()['error'],
      message: exception.getResponse()['message'] || null,
    };

    Logger.error(
      `${errorResponse.method} -> ${errorResponse.path} || ${errorResponse.status} : ${errorResponse.error} [ ${errorResponse.message} ]`,
      exception.stack,
      'HTTP_ERROR_FILTER',
    );

    response.status(status).json(errorResponse);
  }
}
