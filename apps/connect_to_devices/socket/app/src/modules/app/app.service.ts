import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../eventBus/EventBus.service';
import { EventBusRabbitMqService } from '../eventBus/rabbit-mq/services/EventBusRabbitMq.service';
import { ConnectingToDeviceService } from '../connectingToDevice/connectingToDevice.service';
import { DeviceService } from '../devices/device.service';
import {
  ConnectToDeviceList,
  ConnectToDeviceSubTypesList,
} from '../../types/event_bus';
import { SocketTcpService } from '../connectingToDevice/subTypesServices/socket_tcp/socket_tcp.service';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);

  private readonly RECONNECTION_TIMEOUT = 5000;

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly eventBusRabbitMqService: EventBusRabbitMqService,
    private readonly connectingToDeviceService: ConnectingToDeviceService,
    private readonly deviceService: DeviceService
  ) {}

  // запуск сервисов перед запуском
  async startServicesBeforeStart(): Promise<void> {
    try {
      // запуск шины данных
      await this.startEventBus();

      // определение субтипов подключений
      await this.assignSubtype();

      await this.startConnections();
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
    this.connectingToDeviceService.setSubTypes(
      ConnectToDeviceSubTypesList.SOCKET_TCP,
      SocketTcpService
    );
  }

  // Запуск подключений устройств из БД
  private async startConnections() {
    try {
      const responseDeviceGetAll = await this.deviceService.findAll({
        type_name: ConnectToDeviceList.SOCKET,
      });

      // запуск соединений при старте
      if (responseDeviceGetAll && responseDeviceGetAll.devices) {
        for (const device of responseDeviceGetAll.devices) {
          this.connectingToDeviceService.connectionStart(device).catch((e) => {
            this.logger.error(e.message);
          });
        }
      }
    } catch (e) {
      setTimeout(() => {
        console.error('Restart deviceService findAll.');
        this.startConnections();
      }, this.RECONNECTION_TIMEOUT);
    }
  }
}
