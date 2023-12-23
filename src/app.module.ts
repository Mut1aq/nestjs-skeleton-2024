import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModulesModule } from 'modules/modules.module';
import {
  configOptions,
  i18nOptions,
  jwtOptions,
  typeORMOptions,
} from 'shared/configs/app.option';
import { CacheModule } from 'core/lib/cache/cache.module';
import { I18nModule } from 'nestjs-i18n';
import { filters, guards, interceptors } from 'shared/configs/app.config';
import { LoggerModule } from 'core/lib/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from 'core/lib/cron-job/cron-job.module';
import { ConfigModule } from '@nestjs/config';
import helmet from 'helmet';
import { RequestIdMiddleware } from 'core/middlewares/request-id.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    LoggerModule,
    ScheduleModule.forRoot(),
    CronJobModule,
    I18nModule.forRoot(i18nOptions),
    JwtModule.registerAsync(jwtOptions),
    CacheModule.register('cache-manager-redis-yet'),
    TypeOrmModule.forRootAsync(typeORMOptions),
    ModulesModule,
  ],
  controllers: [],
  providers: [...guards, ...filters, ...interceptors],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), RequestIdMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
