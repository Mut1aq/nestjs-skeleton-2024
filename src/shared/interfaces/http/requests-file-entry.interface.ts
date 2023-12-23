import { ResponseFromApp } from 'shared/types/response-from-app.type';
import { LoggedRequestI } from './logged-request.interface';

export interface RequestsFileEntryI {
  request: LoggedRequestI;
  response: ResponseFromApp;
}
