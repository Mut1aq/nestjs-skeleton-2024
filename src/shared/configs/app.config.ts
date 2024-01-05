import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from 'core/exception-filters/http-exception.filter';
import { MongoDbDuplicateKeyFilter } from 'core/exception-filters/mongo-db-duplicate-key.filter';
import { AccessTokenGuard } from 'core/guards/access-token.guard';
import { LoggingInterceptor } from 'core/interceptors/logging.interceptor';
import { ResponseMappingInterceptor } from 'core/interceptors/response-mapping.interceptor';

const accessTokenGuardProvider: Provider<AccessTokenGuard> = {
  provide: APP_GUARD,
  useClass: AccessTokenGuard,
};
const httpExceptionFilterProvider: Provider<HttpExceptionFilter> = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

const loggingInterceptorProvider: Provider<LoggingInterceptor> = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};

const responseMappingInterceptorProvider: Provider<ResponseMappingInterceptor> =
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseMappingInterceptor,
  };

const mongoDbDuplicateKeyFilterProvider: Provider<MongoDbDuplicateKeyFilter> = {
  provide: APP_FILTER,
  useClass: MongoDbDuplicateKeyFilter,
};

export const filters = [
  httpExceptionFilterProvider,
  mongoDbDuplicateKeyFilterProvider,
];
export const guards = [accessTokenGuardProvider];
export const interceptors = [
  loggingInterceptorProvider,
  responseMappingInterceptorProvider,
];
