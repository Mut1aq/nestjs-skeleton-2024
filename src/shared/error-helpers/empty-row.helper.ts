import { HttpException, HttpStatus } from '@nestjs/common';
import { Base } from 'shared/entities/base.entity';

export const emptyRow = (entity: Base | null, entityName: string) => {
  if (!entity)
    throw new HttpException(
      entityName + ' does not exist',
      HttpStatus.NOT_FOUND,
    );
};
