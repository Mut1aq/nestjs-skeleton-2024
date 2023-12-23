import { Module } from '@nestjs/common';
import { ExceptionsFileWriterService } from './exceptions-file-writer.service';
import { RequestsFileWriterService } from './requests-file-writer.service';

@Module({
  providers: [ExceptionsFileWriterService, RequestsFileWriterService],
  exports: [ExceptionsFileWriterService, RequestsFileWriterService],
})
export class FileWriterModule {}
