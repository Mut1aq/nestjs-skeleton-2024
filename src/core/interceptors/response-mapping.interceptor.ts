import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { map, Observable } from 'rxjs';
import {
  isResponseFromService,
  ResponseFromServiceI,
} from 'shared/interfaces/general/response-from-service.interface';
import { ResponseMessage } from 'shared/types/response-message.type';

@Injectable()
export class ResponseMappingInterceptor
  implements
    NestInterceptor<
      ResponseFromServiceI,
      Omit<ResponseFromServiceI, 'message'> & { message: string }
    >
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ResponseFromServiceI>,
  ): Observable<Omit<ResponseFromServiceI, 'message'> & { message: string }> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((responseFromService) => {
        isResponseFromService(responseFromService); // Throw Exception if something is wrong with the response from the service

        const { data, httpStatus, message } = responseFromService;
        const responseFromApp: ResponseFromServiceI = {
          data,
          httpStatus,
          message,
        };

        response.status(httpStatus);

        return {
          ...responseFromApp,
          message: this.translateResponseMessage(message),
        };
      }),
    );
  }

  translateResponseMessage(message: ResponseMessage) {
    const i18n = I18nContext.current<I18nTranslations>();

    return (
      i18n?.translate(
        typeof message === 'string' ? message : message.translationKey,
        typeof message === 'object'
          ? {
              args: {
                [Object.keys(message.args!)[0]]: i18n.translate(
                  message.args![Object.keys(message.args!)[0]],
                ),
              },
            }
          : undefined,
      ) + ''
    );
  }
}
