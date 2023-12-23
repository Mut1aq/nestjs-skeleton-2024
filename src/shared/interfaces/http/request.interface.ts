import { Request } from 'express';
import { DecodedTokenI } from './decoded-token.interface';

export interface RequestI extends Request {
  user: DecodedTokenI;
}
