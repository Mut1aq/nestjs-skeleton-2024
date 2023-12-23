import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseMessage } from 'shared/types/response-message.type';
import { DynamicObjectI } from './dynamic-object.interface';

export interface ResponseFromServiceI<
  T = string | number | DynamicObjectI | DynamicObjectI[] | string[] | number[],
> {
  message: ResponseMessage;
  data: T;
  httpStatus: HttpStatus;
}

export function isResponseFromService(responseFromService?: DynamicObjectI) {
  if (!responseFromService) {
    throw new HttpException(
      'Response from service is falsy',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (
    typeof responseFromService.message !== 'string' &&
    typeof responseFromService.message !== 'object'
  ) {
    throw new HttpException(
      'Response message must be a string or an object',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (!responseFromService.data) {
    throw new HttpException(
      'Response data must be provided',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (!(responseFromService.httpStatus in HttpStatus)) {
    throw new HttpException(
      'Response HttpStatus is incorrect',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
