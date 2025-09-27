import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app/app.module';
import {Logger} from '@nestjs/common';
import {AllExceptionFilter} from './common/filters/allExceptionFilter';
import {AppConfigService} from './configuration/app/config.service';
import {NestExpressApplication} from '@nestjs/platform-express';

async function bootstrap() {
  // Создание сервера
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Получение данных из конфига
  const appConfig: AppConfigService = app.get(AppConfigService);
  const PORT = appConfig.portApplication();
  const nameApplication = appConfig.nameApplication();
  const logger = new Logger(nameApplication);

  app.useGlobalFilters(new AllExceptionFilter());

  // Запуск сервера
  app
    .listen(PORT, () =>
      logger.log(`[DEVICE MANAGEMENT] App has started ${PORT}`, 'bootstrap')
    )
    .catch((e) => logger.error(e.message, 'bootstrap'));
}

bootstrap();
