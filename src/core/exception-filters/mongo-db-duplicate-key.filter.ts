import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { filter } from 'nestjs-conditional-exception-filter';
import { MongoError, MongoServerError } from 'mongodb';
import { RequestI } from 'shared/interfaces/http/request.interface';
import { ExceptionI } from 'shared/interfaces/http/exception.interface';
import { requestMapper } from 'shared/util/request-mapper.util';
import { Response } from 'express';
import { ExceptionsLoggerService } from 'core/lib/logger/exceptions-logger.service';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

@Catch(
  filter({
    for: MongoError,
    when: (error) => error.code === 11000,
  }),
)
export class MongoDbDuplicateKeyFilter implements ExceptionFilter {
  constructor(
    private readonly exceptionsLoggerService: ExceptionsLoggerService,
  ) {}
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestI>();

    try {
      const i18n = I18nContext.current<I18nTranslations>();
      const { keyValue, message } = exception;

      const messageParts = message.split(' index');

      const entity = messageParts[0].split('.')[1];

      const errorMessages = [];

      for (const key in keyValue) {
        const errorMessage = i18n?.translate('validation.uniqueProperty', {
          args: {
            entity,
            property: key,
            value: keyValue[key],
          },
        });
        errorMessages.push(errorMessage);
      }

      const exceptionBody: ExceptionI = {
        request: requestMapper(request),
        statusCode: HttpStatus.CONFLICT,
        time: new Date().toUTCString(),
        message: errorMessages.join(', '),
      };
      this.exceptionsLoggerService.logException(exceptionBody);

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMessages.join(', '),
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error, fire your backend developer',
        request: request.path,
        time: new Date().toUTCString(),
      });
    }
  }
}
