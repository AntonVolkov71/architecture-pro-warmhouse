import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConnectingToDeviceService } from '../../../connectingToDevice/connectingToDevice.service';
import { ConnectToDeviceStartContract } from '../../../../assets/contracts/event_bus/connect_to_device.start';
import { ConnectToDeviceSubTypesList } from '../../../../types/event_bus';
import { ConnectToDeviceStopContract } from '../../../../assets/contracts/event_bus/connect_to_device.stop';

@Injectable()
export class EventBusRabbitMqSubscribersService {
  private readonly logger: Logger = new Logger(
    EventBusRabbitMqSubscribersService.name
  );

  constructor(
    private readonly connectingToDeviceService: ConnectingToDeviceService
  ) {}

  @RabbitSubscribe({
    exchange: ConnectToDeviceStartContract.exchange,
    routingKey: ConnectToDeviceStartContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public handleStart(request: ConnectToDeviceStartContract.Request) {
    if (request && request.device) {
      const { device } = request;
      const typeConnect = device['type_name'];

      if (typeConnect === ConnectToDeviceSubTypesList.SOCKET_TCP) {
        this.connectingToDeviceService
          .connectionStart(device)
          .catch((e: unknown) => {
            if (e instanceof Error) this.logger.error(e.message);
          });

        this.logger.log(
          `Device ${device['ip']} has made connection start request`
        );
      }
    }
  }

  @RabbitSubscribe({
    exchange: ConnectToDeviceStopContract.exchange,
    routingKey: ConnectToDeviceStopContract.routingKey,
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public handleStop(request: ConnectToDeviceStartContract.Request) {
    if (request && request.device) {
      const { device } = request;
      const typeConnect = device['type_name'];

      if (typeConnect === ConnectToDeviceSubTypesList.SOCKET_TCP) {
        this.connectingToDeviceService
          .connectionStop(device)
          .catch((e: unknown) => {
            if (e instanceof Error) this.logger.error(e.message);
          });

        this.logger.log(
          `Device ${device['ip']} has made connection stop request`
        );
      }
    }
  }
}
