import {Injectable} from '@nestjs/common';
import {ConnectingTo} from '../../connecting.interface';
import {EventBusService} from '../../../event_bus/EventBus.service';
import {SocketTcpTelemetryService} from './socket_tcp_telemetry.service';
import {SensorEntity} from '../../../../types/sensors/sensor.interface';
import * as net from 'net';

enum SocketTcpTelemetryDataType {
  TELEMETRY = 'TELEMETRY',
}

@Injectable()
export class SocketTcpService extends ConnectingTo {
  timerRepeat: NodeJS.Timeout;
  private readonly MOCKED_CONNECTION_IP =
    process.env['MOCKED_CONNECTION_IP'] || 'localhost';
  private readonly MOCKED_CONNECTION_PORT = process.env[
    'MOCKED_CONNECTION_PORT'
    ]
    ? Number(process.env['MOCKED_CONNECTION_PORT'])
    : 8083;
  private TIME_OUT_REPEAT = 10000;
  private isCancel = false;
  private client: net.Socket | null;
  private sensor: SensorEntity;
  private readonly socketTcpTelemetryService: SocketTcpTelemetryService;

  constructor(eventBussService: EventBusService) {
    super(eventBussService);

    this.socketTcpTelemetryService = new SocketTcpTelemetryService(
      eventBussService
    );
  }

  start(sensor: SensorEntity): void {
    if (this.isCancel) {
      return;
    }

    this.sensor = sensor;

    try {
      // подключение к серверу Socket.IO
      this.createConnect(sensor);

      this.publishLogInfo(`Socket TCP Connecting ${sensor['name']} started`);
    } catch (e) {
      if (e instanceof Error) {
        this.publishLogError(e.message);
      }
    }
  }

  public stop(sensor: SensorEntity): void {
    try {
      console.info(sensor['name'], 'connection Stop');

      if (this.client) {
        this.client.removeAllListeners();
        this.client.end();
        this.client.destroy();
        this.client = null;
      }

      clearTimeout(this.timerRepeat);

      this.publishLogInfo(
        `Socket default Connecting ${sensor['name']} stopped`
      );
    } catch (e) {
      if (e instanceof Error) {
        this.publishLogError(e.message);
      }
    }
  }

  // создание соединения socket
  private createConnect(sensor: SensorEntity) {
    const host = this.MOCKED_CONNECTION_IP;
    const port = this.MOCKED_CONNECTION_PORT;
    this.client = new net.Socket();

    this.client.connect({port, host}, () => {
      console.info('TCP connected to ' + this.MOCKED_CONNECTION_IP);

      // оповещение о статусе подключения
      this.dispatchConnection(sensor, true);
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
            sensor['id'],
            message
          );
        }
      } catch (e) {
        console.error('Error processing data:', e);
      }
    });

    this.client.on('close', () => {
      console.error('Connection closed');
      this.dispatchConnection(this.sensor, false);

      this.reconnect(sensor);
    });

    this.client.on('error', (error) => {
      console.error('Connection error:', error);
      this.dispatchConnection(this.sensor, false);
      this.reconnect(sensor);
    });
  }

  private reconnect(sensor: SensorEntity) {
    this.timerRepeat = setTimeout(() => {
      this.stop(sensor);
      this.start(sensor);
    }, this.TIME_OUT_REPEAT);
  }

  private dispatchConnection(sensor: SensorEntity, isConnection: boolean) {
    const sensorUpdate = sensor;
    sensorUpdate['status'] = isConnection;
    this.dispatchChangingConnect(sensorUpdate);
  }
}
