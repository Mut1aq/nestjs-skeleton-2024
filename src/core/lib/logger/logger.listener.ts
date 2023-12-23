import { OnModuleInit } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

export class LoggerListener implements OnModuleInit {
  onModuleInit() {
    this.createLogFolderAndFilesIfNotExists();
  }

  createLogFolderAndFilesIfNotExists() {
    if (!existsSync('./logs')) {
      mkdirSync('./logs');
    }
    if (!existsSync('./logs/app-exceptions.json')) {
      createWriteStream('./logs/app-exceptions.json', { flags: 'a' });
    }
    if (!existsSync('./logs/app-requests.json')) {
      createWriteStream('./logs/app-requests.json', { flags: 'a' });
    }
  }
}
