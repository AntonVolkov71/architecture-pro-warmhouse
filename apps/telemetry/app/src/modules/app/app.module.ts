import { Module, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule } from '../../configuration/app/config.module';
import { EventBusConfigModule } from '../../configuration/eventBus/config.module';
import { EventBusModule } from '../eventBus/EventBus.module';
import { EventBusRabbitMqModule } from '../eventBus/rabbit-mq/EventBusRabbitMq.module';
import { ConfigModuleForApp } from '../../utils/connected';
import { AllExceptionFilter } from '../../common/filters/allExceptionFilter';
import { TelemetryModule } from '../telemetry/telemetry.module';

@UseFilters(AllExceptionFilter)
@Module({
  imports: [
    AppConfigModule,
    EventBusConfigModule,
    EventBusModule,
    EventBusRabbitMqModule,
    TelemetryModule,
    ConfigModuleForApp
  ],
  providers: [AppService]
})
export class AppModule {

}
