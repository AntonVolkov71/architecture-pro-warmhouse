import { Module, OnApplicationBootstrap, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule } from '../../configuration/app/config.module';
import { EventBusConfigModule } from '../../configuration/eventBus/config.module';
import { EventBusModule } from '../eventBus/EventBus.module';
import { EventBusRabbitMqModule } from '../eventBus/rabbit-mq/EventBusRabbitMq.module';
import { ConnectingToDeviceModule } from '../connectingToDevice/connectingToDevice.module';
import { ConfigModuleForApp } from '../../utils/connected';
import { DeviceModule } from '../devices/device.module';
import { AllExceptionFilter } from '../../common/filters/allExceptionFilter';

@UseFilters(AllExceptionFilter)
@Module({
  imports: [
    AppConfigModule,
    EventBusConfigModule,
    EventBusModule,
    EventBusRabbitMqModule,
    ConnectingToDeviceModule,
    ConfigModuleForApp,
    DeviceModule,
  ],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.appService.startServicesBeforeStart();
  }
}
