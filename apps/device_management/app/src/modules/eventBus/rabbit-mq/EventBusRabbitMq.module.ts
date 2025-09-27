import {Module} from '@nestjs/common';
import {RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import {EventBusConfigService} from '../../../configuration/eventBus/config.service';
import {EventBusRabbitMqService} from './services/EventBusRabbitMq.service';
import {EventBusRabbitMqSubscribersService} from './services/EventBusRabbitMqSubscribers.service';
import {eventBusSchema} from '../../../types/event_bus';
import {DeviceModule} from '../../device/device.module';

// подключение к шине
const eventBusConfig: EventBusConfigService = new EventBusConfigService();
const uriEventBus = eventBusConfig.uri();

@Module({
    imports: [
        RabbitMQModule.forRoot(RabbitMQModule, {
            uri: uriEventBus,
            exchanges: [eventBusSchema.connect_to_device],
            connectionInitOptions: {wait: true, reject: true},
        }),
        EventBusRabbitMqModule,
        DeviceModule,
    ],
    providers: [EventBusRabbitMqService, EventBusRabbitMqSubscribersService],
    exports: [EventBusRabbitMqService, EventBusRabbitMqSubscribersService],
})
export class EventBusRabbitMqModule {
}
