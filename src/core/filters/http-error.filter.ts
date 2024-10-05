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

    const errorResponse = {
      name: exception.name,
      cause: exception.cause,
      message: exception.message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toLocaleDateString(),
    };

    let status = 500;
    let error = {};
    if (exception instanceof HttpException) {
      error = exception.getResponse();
      status = exception.getStatus();
    }
    errorResponse[`status`] = status;
    errorResponse[`title`] = error[`error`];
    errorResponse[`constraints`] = error[`message`];

    Logger.error(
      `${errorResponse.method} -> ${errorResponse.path} ${status} ${errorResponse.name} "${errorResponse.message}" [${errorResponse['constraints']}]`,
      exception.stack,
      'HTTP_ERROR_FILTER',
    );

    ctx.getResponse().status(status).json(errorResponse);
  }
}
