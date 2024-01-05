import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { RequestI } from 'shared/interfaces/http/request.interface';

export const UserID = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestI>();
    const user = request.user;
    const userID = user.sub;
    if (!isValidObjectId(userID))
      throw new HttpException('ID must be UUID', HttpStatus.BAD_REQUEST);

    return userID;
  },
);
