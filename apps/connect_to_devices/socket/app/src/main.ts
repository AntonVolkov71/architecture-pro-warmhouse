import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/allExceptionFilter';
import { AppConfigService } from './configuration/app/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, raw, text } from 'body-parser';

async function bootstrap() {
  // Создание http сервера
  const httpApp = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
    bodyParser: true,
  });

  httpApp.use(
    json({
      limit: '100mb',
      type: 'application/*',
    })
  );

  httpApp.use(
    raw({
      limit: '100mb',
      type: 'text/*',
    })
  );

  httpApp.use(text({ limit: '100mb' }));
  httpApp.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  // Получение данных из конфига
  const appConfig: AppConfigService = httpApp.get(AppConfigService);
  const nameApplication = appConfig.nameApplication();
  const PORT = appConfig.port();

  const logger = new Logger(nameApplication);

  httpApp.useGlobalFilters(new AllExceptionFilter());

  // Запуск http сервера
  httpApp.listen(PORT, () => {
    logger.log(
      `[SERVICE CONNECT TO DEVICE SOCKET] App has started ${PORT}`,
      'bootstrap'
    );
  });
}

bootstrap();
