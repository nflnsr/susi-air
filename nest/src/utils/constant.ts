const environment = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;

enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

interface IApiResponse<T = unknown> {
  status: ResponseStatus.SUCCESS;
  code: number;
  message: string;
  data?: T;
}

const ApiResponse = <T>(res: IApiResponse): IApiResponse<T> => ({
  status: ResponseStatus.SUCCESS,
  code: res.code,
  message: res.message || 'Request successful',
  data: res?.data as T,
});

interface IErrorResponse {
  status: ResponseStatus.ERROR;
  code: number;
  message: string;
}

// ai generated code
enum BusinessErrorCode {
  FLIGHT_ALREADY_DEPARTED = '5000:FLIGHT_ALREADY_DEPARTED',
  FLIGHT_ALREADY_ARRIVED = '5001:FLIGHT_ALREADY_ARRIVED',
  FLIGHT_ALREADY_CANCELLED = '5002:FLIGHT_ALREADY_CANCELLED',
  FLIGHT_ALREADY_DELAYED = '5003:FLIGHT_ALREADY_DELAYED',
  TICKET_ALREADY_BOOKED = '5004:TICKET_ALREADY_BOOKED',
  TICKET_ALREADY_CANCELLED = '5005:TICKET_ALREADY_CANCELLED',
  TICKET_ALREADY_REFUNDED = '5006:TICKET_ALREADY_REFUNDED',
  TICKET_ALREADY_CHECKED_IN = '5007:TICKET_ALREADY_CHECKED_IN',
  TICKET_ALREADY_BOARDED = '5008:TICKET_ALREADY_BOARDED',
  TICKET_ALREADY_COMPLETED = '5009:TICKET_ALREADY_COMPLETED',
  FARE_ALREADY_EXPIRED = '5010:FARE_ALREADY_EXPIRED',
  FARE_ALREADY_CHANGED = '5011:FARE_ALREADY_CHANGED',
  PAYMENT_ALREADY_PROCESSED = '5012:PAYMENT_ALREADY_PROCESSED',
  PAYMENT_ALREADY_REFUNDED = '5013:PAYMENT_ALREADY_REFUNDED',
  PAYMENT_ALREADY_FAILED = '5014:PAYMENT_ALREADY_FAILED',
  PAYMENT_ALREADY_CANCELLED = '5015:PAYMENT_ALREADY_CANCELLED',
  PAYMENT_ALREADY_COMPLETED = '5016:PAYMENT_ALREADY_COMPLETED',
  PAYMENT_ALREADY_EXPIRED = '5018:PAYMENT_ALREADY_EXPIRED',
}

export {
  environment,
  port,
  ResponseStatus,
  ApiResponse,
  type IApiResponse,
  type IErrorResponse,
  BusinessErrorCode,
};
