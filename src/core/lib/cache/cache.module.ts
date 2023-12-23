import { CacheModule as NestJSCacheModule } from '@nestjs/cache-manager';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { cacheManagerOptions } from 'shared/configs/app.option';
import { CacheService } from './cache.service';

@Global()
@Module({})
export class CacheModule {
  static register(_storeName: string): DynamicModule {
    return {
      providers: [CacheService],
      imports: [NestJSCacheModule.registerAsync(cacheManagerOptions)],
      exports: [CacheService],
      module: CacheModule,
    };
  }
}
