import { Module } from '@nestjs/common';
import { FileWriterModule } from '../file-writer/file-writer.module';
import { ExceptionsLoggerService } from './exceptions-logger.service';
import { LoggerListener } from './logger.listener';
import { LoggerService } from './logger.service';
import { RequestsLoggerService } from './requests-logger.service';

@Module({
  providers: [ExceptionsLoggerService, LoggerService, RequestsLoggerService],
  exports: [ExceptionsLoggerService, RequestsLoggerService],
  imports: [FileWriterModule],
})
export class LoggerModule extends LoggerListener {}
