import { Injectable } from '@nestjs/common';
import { LoggedRequestI } from 'shared/interfaces/http/logged-request.interface';
import { ResponseFromApp } from 'shared/types/response-from-app.type';
import { RequestsFileWriterService } from '../file-writer/requests-file-writer.service';

@Injectable()
export class RequestsLoggerService {
  constructor(
    private readonly requestsFileWriterService: RequestsFileWriterService,
  ) {}

  logRequest(request: LoggedRequestI, response: ResponseFromApp) {
    return this.requestsFileWriterService.writeToRequestsLogFile({
      request,
      response,
    });
  }
}
