import { HttpException, HttpStatus } from '@nestjs/common';
import { BusinessErrorCode, ResponseStatus } from '~/utils/constant.js';

export class BusinessException extends HttpException {
  private businessErrorCode: number;
  private errorMessage: string;

  constructor(error: BusinessErrorCode | string) {
    if (!error.includes(':')) {
      super(
        HttpException.createBody({
          status: ResponseStatus.ERROR,
          code: HttpStatus.BAD_REQUEST,
          message: error,
        }),
        HttpStatus.OK,
      );
      this.businessErrorCode = HttpStatus.BAD_REQUEST;
      this.errorMessage = error;
      return;
    }

    const [code, message] = error.split(':');
    super(
      HttpException.createBody({
        status: ResponseStatus.ERROR,
        code: parseInt(code),
        message: message,
      }),
      HttpStatus.OK,
    );
    this.businessErrorCode = parseInt(code);
    this.errorMessage = message;
  }

  getErrorCode(): number {
    return this.businessErrorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
