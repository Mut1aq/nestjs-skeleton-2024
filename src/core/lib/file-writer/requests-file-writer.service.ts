import { Injectable } from '@nestjs/common';
import { createWriteStream, statSync } from 'fs';
import { RequestsFileEntryI } from 'shared/interfaces/http/requests-file-entry.interface';

@Injectable()
export class RequestsFileWriterService {
  private get requestsLogFilePath() {
    return './logs/app-requests.json';
  }

  /**
   *  https://stackoverflow.com/questions/54541196/append-json-to-a-file-using-node-streams
   */
  writeToRequestsLogFile(requestsFileEntry: RequestsFileEntryI) {
    try {
      const writeStream = createWriteStream(this.requestsLogFilePath, {
        flags: 'r+',
        start: statSync(this.requestsLogFilePath).size - 2,
      });

      writeStream.write(
        JSON.stringify([requestsFileEntry], null, 2).replace(/\[/, ','),
        (streamError) => {
          return streamError;
        },
      );
    } catch (error: any) {
      if (error instanceof RangeError) {
        const writeStream = createWriteStream(this.requestsLogFilePath, {
          flags: 'r+',
        });

        writeStream.write(
          JSON.stringify([requestsFileEntry], null, 2),
          (streamError) => {
            return streamError;
          },
        );
      }
    }
  }
}
