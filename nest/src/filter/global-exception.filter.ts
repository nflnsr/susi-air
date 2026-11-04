import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BusinessException } from '~/filter/exception/business.exception.js';
import { IErrorResponse, ResponseStatus } from '~/utils/constant.js';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const code = this.getErrorCode(exception);
    let message = this.getErrorMessage(exception);

    const responseBody = {
      status: ResponseStatus.ERROR,
      code: code,
      message: message,
    };

    response.status(code).json(responseBody);
  }

  private getErrorCode(exception: T): number {
    if (exception instanceof BusinessException) {
      return exception.getErrorCode(); // method from BusinessException to get the error code
    } else if (exception instanceof HttpException) {
      return exception.getStatus(); // method from HttpException nestjs to get the status code
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR; // 500, caught error from database
    } else {
      return (
        (exception as IErrorResponse)?.code ?? HttpStatus.INTERNAL_SERVER_ERROR // 500, uncaught error
      );
    }
  }

  private getErrorMessage(exception: T): string {
    if (exception instanceof BusinessException) {
      return exception.getErrorMessage(); // method from BusinessException to get the error message
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse(); // method from HttpException nestjs to get the response message

      if (typeof response === 'string') {
        return response;
      }

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        return response.message as string;
      }

      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return (exception as QueryFailedError).message; // caught error from database
    } else {
      return (exception as IErrorResponse)?.message ?? 'Internal server error'; // uncaught error
    }
  }
}
