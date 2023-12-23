import { DynamicObjectI } from '../general/dynamic-object.interface';
import { RequestMethod } from '@nestjs/common';
export interface LoggedRequestI {
  id: string;
  path: string;
  body: DynamicObjectI;
  queryParams: DynamicObjectI;
  routeParams: DynamicObjectI;
  token?: string;
  lang: string;
  method: RequestMethod;
}
