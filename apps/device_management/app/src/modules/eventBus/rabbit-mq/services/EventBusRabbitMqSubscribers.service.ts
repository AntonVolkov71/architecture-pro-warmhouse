import {Injectable, Logger} from '@nestjs/common';
import {RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import {DeviceService} from '../../../device/device.service';
import {EventsChangeConnectEmitContract} from '../../../../assets/contracts/event_bus/event.change_connect.emit';

@Injectable()
export class EventBusRabbitMqSubscribersService {
    private readonly logger: Logger = new Logger(
        EventBusRabbitMqSubscribersService.name
    );

    constructor(
        private readonly deviceService: DeviceService
    ) {
    }

    @RabbitSubscribe({
        exchange: EventsChangeConnectEmitContract.exchange,
        routingKey: EventsChangeConnectEmitContract.routingKey,
        queueOptions: {
            durable: true,
            autoDelete: true
        }
    })
    public handleStatusDevice(request: EventsChangeConnectEmitContract.Request) {
        try {
            this.deviceService.handleStatusDevice(request.device);
        } catch (e) {
            let message;
            if (e instanceof Error) {
                message = e.message;
            } else {
                message = e;
            }

            this.logger.error('Error handleStatusDevice', message);
        }
    }
}
