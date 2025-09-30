import {Injectable, Logger} from '@nestjs/common';
import {RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import {EventsChangeConnectEmitContract} from '../../../../assets/contracts/event_bus/event.change_connect.emit';
import {SensorsService} from '../../../sensors/sensors.service';

@Injectable()
export class EventBusRabbitMqSubscribersService {
  private readonly logger: Logger = new Logger(
    EventBusRabbitMqSubscribersService.name
  );

  constructor(
    private readonly sensorsService: SensorsService
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
  public handleStatus(request: EventsChangeConnectEmitContract.Request) {
    try {
      this.sensorsService.handleStatus(request.sensor);
    } catch (e) {
      let message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = e;
      }

      this.logger.error('Error handleStatus', message);
    }
  }
}
