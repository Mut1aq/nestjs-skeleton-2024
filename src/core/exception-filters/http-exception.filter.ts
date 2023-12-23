import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RequestI } from 'shared/interfaces/http/request.interface';
import { Response } from 'express';
import { ExceptionsLoggerService } from 'core/lib/logger/exceptions-logger.service';
import { requestMapper } from 'shared/util/request-mapper.util';
import { ExceptionI } from 'shared/interfaces/http/exception.interface';
import { HttpStatus } from '@nestjs/common/enums';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly exceptionsLoggerService: ExceptionsLoggerService,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestI>();
    const statusCode = exception.getStatus();
    try {
      const { message } = exception;

      const loggedRequest = requestMapper(request);

      const loggedException: ExceptionI = {
        statusCode,
        message,
        time: new Date().toUTCString(),
        request: loggedRequest,
      };

      this.exceptionsLoggerService.logException(loggedException);

      response.status(statusCode).json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } catch (error: any) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          'Something went wrong with your backend, fire the backend developer',
      });
    }
  }
}
