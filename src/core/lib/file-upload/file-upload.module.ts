import { Module } from '@nestjs/common';
import { PostUploadService } from './post-upload.service';

@Module({
  providers: [PostUploadService],
})
export class FileUploadModule {}
