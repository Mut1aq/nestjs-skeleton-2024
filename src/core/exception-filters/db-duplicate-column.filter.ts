import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RequestI } from 'shared/interfaces/http/request.interface';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { Response } from 'express';
import { filter } from 'nestjs-conditional-exception-filter';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

@Catch(
  filter({
    for: TypeORMError,
    when: (error: any) => error.code === '23505',
  }),
)
export class DbDuplicateColumnFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: TypeORMError & QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestI>();
    const i18n = I18nContext.current<I18nTranslations>(host);

    try {
      const { table, detail } = exception.driverError;

      const messageParts = (detail + '').split('(');

      const column = messageParts[1].substring(0, messageParts[1].length - 2);
      const value = messageParts[2].substring(
        0,
        messageParts[2].lastIndexOf(')'),
      );

      const message = i18n?.translate('validation.uniqueProperty', {
        args: {
          entity: table,
          property: column,
          value,
        },
      });

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          'Something went wrong with your backend, fire the backend developer',
      });
    }
  }
}
