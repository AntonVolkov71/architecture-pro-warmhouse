import { Injectable } from '@nestjs/common';
import { ConnectingToDeviceInterface } from '../../connectingToDevice.interface';
import { EventBusService } from '../../../eventBus/EventBus.service';
import * as net from 'net';
import { SocketTcpTelemetryService } from './socket_tcp_telemetry.service';
import { DeviceDto } from '../../../../types/event_bus';

enum SocketTcpTelemetryDataType {
  TELEMETRY = 'TELEMETRY',
}

@Injectable()
export class SocketTcpService extends ConnectingToDeviceInterface {
  timerRepeat: NodeJS.Timeout;

  private TIME_OUT_REPEAT = 10000;
  private isCancel = false;
  private client: net.Socket | null;
  private device: DeviceDto;

  private readonly socketTcpTelemetryService: SocketTcpTelemetryService;

  constructor(eventBussService: EventBusService) {
    super(eventBussService);

    this.socketTcpTelemetryService = new SocketTcpTelemetryService(
      eventBussService
    );
  }

  connectionStart(device: DeviceDto): void {
    if (this.isCancel) {
      return;
    }

    this.device = device;

    try {
      // подключение к серверу Socket.IO
      this.createConnect(device);

      this.publishLogInfo(`Socket TCP Connecting ${device['ip']} started`);
    } catch (e) {
      if (e instanceof Error) {
        this.publishLogError(e.message);
      }
    }
  }

  public connectionStop(device: DeviceDto): void {
    try {
      console.log(device.ip, 'connection Stop');
      if (this.client) {
        this.client.removeAllListeners();
        this.client.end();
        this.client.destroy();
        this.client = null;
      }

      clearTimeout(this.timerRepeat);

      this.publishLogInfo(`Socket default Connecting ${device['ip']} stopped`);
    } catch (e) {
      if (e instanceof Error) {
        this.publishLogError(e.message);
      }
    }
  }

  // создание соединения socket
  private createConnect(device: DeviceDto) {
    const { ip, port } = device;

    this.client = new net.Socket();

    this.client.connect({ port: Number(port), host: ip }, () => {
      console.info('TCP connected to ' + ip + ':' + port);
      // оповещение о статусе подключения
      this.dispatchConnection(this.device, true);
    });

    this.client.on('data', (data: Buffer) => {
      try {
        const message = data.toString().trim();

        const parseMessage = JSON.parse(message);
        const queryTelemetry =
          'query' in parseMessage &&
          parseMessage['query'] === SocketTcpTelemetryDataType.TELEMETRY;

        if (queryTelemetry) {
          this.socketTcpTelemetryService.handleDataTelemetry(
            device['id'],
            message
          );
        }
      } catch (e) {
        console.error('Error processing data:', e);
      }
    });

    this.client.on('close', () => {
      console.log('Connection closed');
      this.dispatchConnection(this.device, false);

      this.reconnect(device);
    });

    this.client.on('error', (error) => {
      console.error('Connection error:', error);
      this.dispatchConnection(this.device, false);
      this.reconnect(device);
    });
  }

  private reconnect(device: DeviceDto) {
    this.timerRepeat = setTimeout(() => {
      this.connectionStop(device);
      this.connectionStart(device);
    }, this.TIME_OUT_REPEAT);
  }

  private dispatchConnection(device: DeviceDto, isConnection: boolean) {
    const deviceIsConnection = device;
    deviceIsConnection['status_connection'] = isConnection;
    this.dispatchChangingConnect(deviceIsConnection);
  }
}
