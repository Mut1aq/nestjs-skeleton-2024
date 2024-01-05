import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModuleOptions } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nOptions,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { RedisClientOptions } from 'redis';
import * as Joi from 'joi';
import { ConfigService } from '@nestjs/config/dist';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const jwtOptions: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('USER_ACCESS_TOKEN_SECRET')!,
  }),
  global: true,
  inject: [ConfigService],
};

export const cacheManagerOptions: CacheModuleAsyncOptions<RedisClientOptions> =
  {
    useFactory: async (configService: ConfigService) => ({
      store: redisStore,
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: +configService.get<number>('REDIS_PORT')!,
        tls: false,
      },
    }),
    inject: [ConfigService],
  };

export const i18nOptions: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: join(__dirname, '../../resources/i18n'),
    watch: true,
  },
  typesOutputPath: join(
    `${process.cwd()}/src/resources/generated/i18n.generated.ts`,
  ),
  resolvers: [
    { use: QueryResolver, options: ['lang', 'locale', 'l'] },
    new HeaderResolver(['x-custom-lang']),
    AcceptLanguageResolver,
    new CookieResolver(['lang', 'locale', 'l']),
  ],
};

export const configOptions: ConfigModuleOptions = {
  envFilePath: `.${process.env.NODE_ENV ?? 'development'}.env`,
  isGlobal: true,
  cache: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .min(3)
      .max(6)
      .valid('dev', 'prod', 'stable')
      .required(),
    PORT: Joi.number().required(),
    USER_ACCESS_TOKEN_SECRET: Joi.string().min(10).required(),
    USER_ACCESS_TOKEN_EXPIRES_IN: Joi.string().min(1).required(),
    ALLOWED_HOSTS: Joi.string().min(1).required(),
    PREFIX: Joi.string().min(3).max(10).required(),
    APP_NAME: Joi.string().min(3).max(30).required(),
  }),
};

export const mongooseOptions: MongooseModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI')!,
    dbName: `nestJSSkeleton${
      configService.get<string>('NODE_ENV')!.charAt(0).toUpperCase() +
      configService.get<string>('NODE_ENV')!.slice(1)
    }DB`,
    retryAttempts: 5,
    retryDelay: 10000,
  }),
  inject: [ConfigService],
};
