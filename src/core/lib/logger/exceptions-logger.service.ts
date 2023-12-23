import { Injectable } from '@nestjs/common';
import { ExceptionI } from 'shared/interfaces/http/exception.interface';
import { ExceptionsFileWriterService } from '../file-writer/exceptions-file-writer.service';

@Injectable()
export class ExceptionsLoggerService {
  constructor(
    private readonly exceptionsFileWriterService: ExceptionsFileWriterService,
  ) {}

  logException(exception: ExceptionI) {
    return this.exceptionsFileWriterService.writeToExceptionsLogFile(exception);
  }
}
