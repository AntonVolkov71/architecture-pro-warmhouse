import { Injectable, Scope } from '@nestjs/common';
import { EventBusService } from '../eventBus/EventBus.service';
import { DeviceDto } from '../../types/event_bus';
import { Telemetry } from '../../types/telemetry';
import { TelemetryEmitContract } from '../../assets/contracts/event_bus/event.telemetry.emit';
import { EventsChangeConnectEmitContract } from '../../assets/contracts/event_bus/event.change_connect.emit';

Injectable({
  scope: Scope.TRANSIENT
});

export abstract class ConnectingToDeviceInterface {

  protected constructor(protected readonly eventBusService: EventBusService) {
  }


  abstract connectionStart(device: DeviceDto): void;

  abstract connectionStop(device: DeviceDto): void;

  protected dispatchTelemetry(data: Telemetry) {
    if (this.eventBusService) {
      this.eventBusService.publish<TelemetryEmitContract.Request>(
        TelemetryEmitContract.routingKey,
        TelemetryEmitContract.exchange,
        { data }
      );
    }
  }

  protected dispatchChangingConnect(device: DeviceDto) {
    if (this.eventBusService) {
      this.eventBusService.publish<EventsChangeConnectEmitContract.Request>(
        EventsChangeConnectEmitContract.routingKey,
        EventsChangeConnectEmitContract.exchange,
        { device }
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
