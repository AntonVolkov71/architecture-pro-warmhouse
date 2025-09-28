import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConnectToStartContract } from '../../../../assets/contracts/event_bus/connect_to.start';
import { ConnectToStopContract } from '../../../../assets/contracts/event_bus/connect_to.stop';
import { ConnectingToService } from '../../../connecting/connecting.service';
import {
  ConnectType,
  SensorEntity,
} from '../../../../types/sensors/sensor.interface';
import { CommandSensorContract } from '../../../../assets/contracts/event_bus/command.sensor.emit';

@Injectable()
export class EventBusRabbitMqSubscribersService {
  private readonly logger: Logger = new Logger(
    EventBusRabbitMqSubscribersService.name
  );

  constructor(private readonly connectingToService: ConnectingToService) {}

  @RabbitSubscribe({
    exchange: ConnectToStartContract.exchange,
    routingKey: ConnectToStartContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public handleStart(request: ConnectToStartContract.Request) {
    if (request && request.sensor && this.isSocketConnectType(request.sensor)) {
      this.connectingToService.start(request.sensor).catch((e: unknown) => {
        if (e instanceof Error) this.logger.error(e.message);
      });

      this.logger.log(
        `Device ${request.sensor['name']} has made connection start request`
      );
    }
  }

  @RabbitSubscribe({
    exchange: ConnectToStopContract.exchange,
    routingKey: ConnectToStopContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public handleStop(request: ConnectToStartContract.Request) {
    if (request && request.sensor && this.isSocketConnectType(request.sensor)) {
      this.connectingToService.stop(request.sensor).catch((e: unknown) => {
        if (e instanceof Error) this.logger.error(e.message);
      });

      this.logger.log(
        `Device ${request.sensor['name']} has made connection stop request`
      );
    }
  }

  @RabbitSubscribe({
    exchange: CommandSensorContract.exchange,
    routingKey: CommandSensorContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public handleCommand(request: CommandSensorContract.Request) {
    if (request && request.sensor && this.isSocketConnectType(request.sensor)) {
      console.info('request command', request.command);
    }
  }

  private isSocketConnectType(sensor: SensorEntity): boolean {
    const connectType = sensor['connect_type'];

    return connectType === ConnectType.SOCKET;
  }
}
