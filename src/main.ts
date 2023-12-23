import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from 'core/lib/logger/logger.service';
import helmet from 'helmet';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  // ======================================================
  // ? Initialization
  // ======================================================

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get<LoggerService>(LoggerService);
  const configService = app.get<ConfigService>(ConfigService);
  const prefix = configService.get<string>('PREFIX')!;
  const port = +configService.get<number>('PORT')! || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV')!;

  // ======================================================
  // ! security
  // ======================================================

  app.enable('trust proxy');
  app.set('etag', 'strong');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.enableCors({
    origin: configService.get<string>('ALLOWED_HOSTS')!,
    credentials: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    maxAge: 3600,
  });
  app.setGlobalPrefix(nodeEnv + '/' + prefix);
  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new I18nValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  );

  // ======================================================
  // * configs
  // ======================================================

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useLogger(logger);

  if (nodeEnv === 'prod') {
    const config = new DocumentBuilder()
      .setTitle('NestJS Skeleton')
      .setDescription(
        'Starter code for lightweight to middle size projects (Backend Development: NestJS)',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config, {});
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(port, () => {
    logger.log(
      `Application is running on port: ${port} 🚀 `,
      'NestApplication',
    );
  });
}
bootstrap();
