import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { EventBusConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      // envFilePath: ['envs/.connect-to-device-json.env', 'envs/.env'],
      isGlobal: true,
    }),
  ],

  providers: [ConfigService, EventBusConfigService],
  exports: [EventBusConfigService],
})
export class EventBusConfigModule {}
