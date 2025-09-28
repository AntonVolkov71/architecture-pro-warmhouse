import {Injectable, Scope} from '@nestjs/common';
import {Telemetry} from '../../types/telemetry';
import {TelemetryEmitContract} from '../../assets/contracts/event_bus/event.telemetry.emit';
import {EventsChangeConnectEmitContract} from '../../assets/contracts/event_bus/event.change_connect.emit';
import {SensorEntity} from '../../types/sensors/sensor.interface';
import {EventBusService} from '../event_bus/EventBus.service';

Injectable({
  scope: Scope.TRANSIENT,
});

export abstract class ConnectingTo {
  protected constructor(protected readonly eventBusService: EventBusService) {
  }

  abstract start(sensor: SensorEntity): void;

  abstract stop(sensor: SensorEntity): void;

  protected dispatchTelemetry(data: Telemetry) {
    if (this.eventBusService) {
      this.eventBusService.publish<TelemetryEmitContract.Request>(
        TelemetryEmitContract.routingKey,
        TelemetryEmitContract.exchange,
        {data}
      );
    }
  }

  protected dispatchChangingConnect(sensor: SensorEntity) {
    if (this.eventBusService) {
      this.eventBusService.publish<EventsChangeConnectEmitContract.Request>(
        EventsChangeConnectEmitContract.routingKey,
        EventsChangeConnectEmitContract.exchange,
        {sensor}
      );
    }
  }

  protected publishLogInfo(message: string) {
    console.info(message);
  }

  protected publishLogError(message: string) {
    console.error(message);
  }
}
