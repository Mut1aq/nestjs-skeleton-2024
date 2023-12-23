import { Module } from '@nestjs/common';
import { ExceptionClearTaskService } from './exception-clear-task.service';

@Module({
  providers: [ExceptionClearTaskService]
})
export class CronJobModule {}
