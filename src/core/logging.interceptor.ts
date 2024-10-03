import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const body = request.body;
    const url = request.url;
    const now = Date.now();

    const logBody = (body: any, url: string) => {
      if (!body || !Object.keys(body).length) {
        return `NO_REQUEST_BODY `;
      } else {
        delete body.password;
        if (url === '/auth/sign-in') {
          return `REQUEST_BODY -> ${JSON.stringify(body)}`;
        } else if (url === '/auth/sign-up') {
          return `REQUEST_BODY -> ${JSON.stringify(body)}`;
        } else {
          return `REQUEST_BODY -> ${JSON.stringify(body)}`;
        }
      }
    };

    const logSignedUser = (user) => {
      if (!user || !Object.keys(user).length) {
        return `NO_SIGNED_USER `;
      }
      return `SIGNED_USER -> ${user.id}`;
    };

    const logQueryParams = (query) => {
      if (!query || !Object.keys(query).length) {
        return `NO_QUERY_PARAMS `;
      }
      return 'QUERY_PARAMS -> ' + JSON.stringify(query);
    };

    const logRouteParams = (params) => {
      if (!params || !Object.keys(params).length) {
        return `NO_ROUTE_PARAMS `;
      }
      return 'ROUTE_PARAMS -> ' + JSON.stringify(params);
    };

    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `${logSignedUser(
            request.user,
          )} ::: ${method} -> ${url} :|{ ${logBody(body, url)} }|[ ${logRouteParams(
            request.params,
          )} ]|( ${logQueryParams(request.query)} )|: ${Date.now() - now}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
