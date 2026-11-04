import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PASS_TRANSFORM_KEY } from '../decorator/pass-transform.decorator.js';
import { RESPONSE_MESSAGE_KEY } from '../decorator/response-message.decorator.js';
import { ResponseStatus } from '../utils/constant.js';
import { ApiResponse } from '../utils/constant.js';

@Injectable()
export class TransformInterceptor<T = unknown> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const custom = this.reflector.get<boolean>(
      PASS_TRANSFORM_KEY,
      context.getHandler(),
    );

    if (custom) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const response = http.getResponse();
    // const request = http.getRequest<Request>();

    // ?a[]=1&a[]=2 => { a: [1, 2] }
    // request.query = qs.parse(request.url.split('?').at(1));

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
      'Request successful';

    return next.handle().pipe(
      map((data: T) =>
        ApiResponse<T>({
          status: ResponseStatus.SUCCESS,
          code: response.statusCode,
          message: message,
          data,
        }),
      ),
    );
  }
}
