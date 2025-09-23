import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../../eventBus/EventBus.service';
import { Telemetry } from '../../../../types/telemetry';
import { TelemetryEmitContract } from '../../../../assets/contracts/event_bus/event.telemetry.emit';

@Injectable()
export class SocketTcpTelemetryService {
  constructor(private readonly eventBusService: EventBusService) {}

  public handleDataTelemetry(deviceID: number, message: string) {
    try {
      const telemetry: Telemetry = this.buildTelemetry(deviceID, message);

      this.eventBusService.publish<TelemetryEmitContract.Request>(
        TelemetryEmitContract.routingKey,
        TelemetryEmitContract.exchange,
        { data: telemetry }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.error('SocketTCPService', e.message);
      }
    }
  }

  private buildTelemetry(deviceID: number, message: string): Telemetry {
    const parseData = JSON.parse(message);
    return {
      device_id: deviceID,
      air_temperature: parseData['air_temperature'],
      humidity: parseData['humidity'],
      status_connection: parseData['status_connection'],
    };
  }
}
