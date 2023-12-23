import { Injectable } from '@nestjs/common';
import { createWriteStream, statSync } from 'fs';
import { ExceptionI } from 'shared/interfaces/http/exception.interface';

@Injectable()
export class ExceptionsFileWriterService {
  private get exceptionsLogFilePath() {
    return './logs/app-exceptions.json';
  }

  /**
   *  https://stackoverflow.com/questions/54541196/append-json-to-a-file-using-node-streams
   */
  writeToExceptionsLogFile(exception: ExceptionI) {
    try {
      const writeStream = createWriteStream(this.exceptionsLogFilePath, {
        flags: 'r+',
        start: statSync(this.exceptionsLogFilePath).size - 2,
      });

      writeStream.write(
        JSON.stringify([exception], null, 2).replace(/\[/, ','),
        (streamError) => {
          return streamError;
        },
      );
    } catch (error: any) {
      if (error instanceof RangeError) {
        const writeStream = createWriteStream(this.exceptionsLogFilePath, {
          flags: 'r+',
        });

        writeStream.write(
          JSON.stringify([exception], null, 2),
          (streamError) => {
            return streamError;
          },
        );
      }
    }
  }
}
