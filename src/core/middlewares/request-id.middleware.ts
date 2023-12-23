import { Injectable, NestMiddleware } from '@nestjs/common';
import { isCuid, createId } from '@paralleldrive/cuid2';
import { NextFunction, Request, Response } from 'express';
import { REQUEST_ID_TOKEN_HEADER } from 'shared/constants/general.constant';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestID = req.header(REQUEST_ID_TOKEN_HEADER);

    if (
      !req.headers[REQUEST_ID_TOKEN_HEADER] ||
      (requestID && !isCuid(requestID))
    )
      req.headers[REQUEST_ID_TOKEN_HEADER] = createId();

    res.set(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
    next();
  }
}
