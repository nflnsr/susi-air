import { HttpException } from '@nestjs/common';
import { type IErrorResponse, ResponseStatus } from '~/utils/constant.js';

export class AppException extends HttpException {
  constructor({ code, message }: Omit<IErrorResponse, 'status'>) {
    const errorResponse: IErrorResponse = {
      status: ResponseStatus.ERROR,
      code: code,
      message: message,
    };

    super(errorResponse, code);
  }
}
