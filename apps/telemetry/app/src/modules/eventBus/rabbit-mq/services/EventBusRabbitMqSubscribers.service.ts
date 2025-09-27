import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TelemetryEmitContract } from '../../../../assets/contracts/event_bus/event.telemetry.emit';
import { TelemetryService } from '../../../telemetry/telemetry.service';

@Injectable()
export class EventBusRabbitMqSubscribersService {
  private readonly logger: Logger = new Logger(
    EventBusRabbitMqSubscribersService.name
  );

  constructor(
    private readonly telemetryService: TelemetryService
  ) {
  }

  @RabbitSubscribe({
    exchange: TelemetryEmitContract.exchange,
    routingKey: TelemetryEmitContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true
    }
  })
  public handleTelemetry(request: TelemetryEmitContract.Request) {
    try {
      this.telemetryService.handleData(request.data);
    } catch (e) {
      let message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = e;
      }

      this.logger.error('Error handleTelemetry', message);
    }
  }
}
