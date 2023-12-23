import { ResponseFromInterceptorI } from 'shared/interfaces/general/response-from-interceptor.interface';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';

export type ResponseFromApp = ResponseFromInterceptorI & ResponseFromServiceI;
