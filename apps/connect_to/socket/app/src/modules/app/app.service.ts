import {Injectable} from '@nestjs/common';
import {EventBusService} from '../event_bus/EventBus.service';
import {EventBusRabbitMqService} from '../event_bus/rabbit-mq/services/EventBusRabbitMq.service';
import {ConnectingToService} from '../connecting/connecting.service';
import {SocketTcpService} from '../connecting/services/socket_tcp/socket_tcp.service';
import {ConnectSubType} from '../../types/sensors/sensor.interface';

@Injectable()
export class AppService {
  private readonly RECONNECTION_TIMEOUT = 5000;

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly eventBusRabbitMqService: EventBusRabbitMqService,
    private readonly connectingToService: ConnectingToService
  ) {
  }

  // запуск сервисов перед запуском
  async startServicesBeforeStart(): Promise<void> {
    try {
      // запуск шины данных
      await this.startEventBus();

      // определение субтипов подключений
      await this.assignSubtype();

      // const sensor: SensorEntity = {
      //   name: 'test',
      //   type: SensorType.TEMPERATURE,
      //   location: 'msc',
      //   unit: 'unitnitnit',
      //   id: 21,
      //   connect_type: ConnectType.SOCKET,
      //   connect_sub_type: ConnectSubType.SOCKET_TCP,
      //   value: 0,
      //   status: false,
      //   last_updated: new Date(),
      //   created_at: new Date()
      // }
      // await this.connectingToService.start(sensor)
    } catch (e) {
      setTimeout(() => {
        console.error('Restart before connection.');
        this.startServicesBeforeStart();
      }, this.RECONNECTION_TIMEOUT);
    }
  }

  private async startEventBus() {
    this.eventBusService.setEventBusInterface(this.eventBusRabbitMqService);

    this.eventBusService.connected();
  }

  private async assignSubtype() {
    // Socket TCP
    this.connectingToService.setSubTypes(
      ConnectSubType.SOCKET_TCP,
      SocketTcpService
    );
  }
}
