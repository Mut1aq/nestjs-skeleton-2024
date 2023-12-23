import { HttpStatus } from '@nestjs/common';
import { LoggedRequestI } from './logged-request.interface';

export interface ExceptionI {
  statusCode: HttpStatus;
  message: string;
  request: LoggedRequestI;
  time: string;
}
