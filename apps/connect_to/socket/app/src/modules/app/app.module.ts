import { Module, OnApplicationBootstrap, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AllExceptionFilter } from '../../common/filters/allExceptionFilter';
import { AppConfigModule } from '../../configuration/app/config.module';
import { EventBusConfigModule } from '../../configuration/eventBus/config.module';
import { EventBusModule } from '../event_bus/EventBus.module';
import { ConnectingToModule } from '../connecting/connecting.module';
import { EventBusRabbitMqModule } from '../event_bus/rabbit-mq/EventBusRabbitMq.module';
import { ConfigModuleForApp } from 'app/src/utils/connected';

@UseFilters(AllExceptionFilter)
@Module({
  imports: [
    AppConfigModule,
    EventBusConfigModule,
    EventBusModule,
    EventBusRabbitMqModule,
    ConnectingToModule,
    ConfigModuleForApp,
  ],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.appService.startServicesBeforeStart();
  }
}
