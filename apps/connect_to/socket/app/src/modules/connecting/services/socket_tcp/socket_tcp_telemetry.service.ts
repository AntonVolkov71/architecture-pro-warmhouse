import { Injectable } from '@nestjs/common';
import { Telemetry } from '../../../../types/telemetry';
import { TelemetryEmitContract } from '../../../../assets/contracts/event_bus/event.telemetry.emit';
import { EventBusService } from '../../../event_bus/EventBus.service';

@Injectable()
export class SocketTcpTelemetryService {
  constructor(private readonly eventBusService: EventBusService) {}

  public handleDataTelemetry(sensorId: number, message: string) {
    try {
      const telemetry: Telemetry = this.buildTelemetry(sensorId, message);
      console.info('telemetry', telemetry);
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

  private buildTelemetry(sensorId: number, message: string): Telemetry {
    const parseData = JSON.parse(message);
    return {
      sensor_id: sensorId,
      air_temperature: parseData['air_temperature'],
      humidity: parseData['humidity'],
      status_connection: parseData['status_connection'],
    };
  }
}
