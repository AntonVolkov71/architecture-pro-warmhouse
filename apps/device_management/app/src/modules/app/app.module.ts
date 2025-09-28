import {Module, OnApplicationBootstrap, UseFilters} from '@nestjs/common';
import {AppService} from './app.service';
import {AppConfigModule} from '../../configuration/app/config.module';
import {EventBusConfigModule} from '../../configuration/eventBus/config.module';
import {EventBusModule} from '../eventBus/EventBus.module';
import {EventBusRabbitMqModule} from '../eventBus/rabbit-mq/EventBusRabbitMq.module';
import {ConfigModuleForApp, connectedToDB} from '../../utils/connected';
import {AllExceptionFilter} from '../../common/filters/allExceptionFilter';
import {V1Module} from '../api/v1/v1.module';
import {SensorsModule} from '../sensors/sensors.module';
import {DatabaseConfigModule} from '../../configuration/database/config.module';

@UseFilters(AllExceptionFilter)
@Module({
  imports: [
    AppConfigModule,
    EventBusConfigModule,
    EventBusModule,
    EventBusRabbitMqModule,
    DatabaseConfigModule,
    ConfigModuleForApp,
    connectedToDB,
    V1Module,
    SensorsModule,
  ],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.appService.startServicesBeforeStart();
  }
}
