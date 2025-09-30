import {Injectable, Logger, Type} from '@nestjs/common';
import {ConnectingTo} from './connecting.interface';
import {ConnectSubType, SensorEntity,} from '../../types/sensors/sensor.interface';
import {EventBusService} from '../event_bus/EventBus.service';

type subTypesState = {
  [key in ConnectSubType]: Type<ConnectingTo>;
};

@Injectable()
export class ConnectingToService {
  public readonly connectingContainer: Map<string, ConnectingTo>;
  private readonly logger: Logger = new Logger(ConnectingToService.name);
  private readonly subTypes: subTypesState;

  constructor(private readonly eventBusService: EventBusService) {
    this.subTypes = {} as subTypesState;
    this.connectingContainer = new Map<string, ConnectingTo>();
  }

  public setSubTypes(
    subType: ConnectSubType,
    service: Type<ConnectingTo>
  ): void {
    this.subTypes[subType] = service;
  }

  public async start(sensor: SensorEntity) {
    try {
      const uniqueId = this.createUniqueId(sensor); // уникальный id для сохранения в стейт Map

      // если по этому устройству соединение присутствует, получаем его останавливаем и удаляем
      if (this.connectingContainer.has(uniqueId)) {
        const connect = this.connectingContainer.get(uniqueId);

        if (connect) {
          connect.stop(sensor);
        }

        this.connectingContainer.delete(uniqueId);
      }

      const SubType = this.subTypes[sensor['connect_sub_type']];

      const instanceSubType = new SubType(this.eventBusService);
      this.connectingContainer.set(uniqueId, instanceSubType);

      instanceSubType.start(sensor);
    } catch (err) {
      if (err instanceof Error) this.logger.error(err.message);
    }
  }

  public async stop(sensor: SensorEntity) {
    try {
      const connecting = this.getConnecting(sensor);

      if (connecting) connecting.stop(sensor);

      this.clearConnecting(sensor);
    } catch (err) {
      if (err instanceof Error) this.logger.error(err.message);
    }
  }

  private getConnecting(sensor: SensorEntity): ConnectingTo | undefined {
    const uniqueId = this.createUniqueId(sensor); // уникальный id для сохранения в стейт Map

    if (this.connectingContainer && this.connectingContainer.has(uniqueId)) {
      return this.connectingContainer.get(uniqueId);
    }

    return undefined;
  }

  private clearConnecting(sensor: SensorEntity): void {
    const uniqueId = this.createUniqueId(sensor); // уникальный id для сохранения в стейт Map

    if (this.connectingContainer && this.connectingContainer.has(uniqueId)) {
      this.connectingContainer.delete(uniqueId);
    }
  }

  private createUniqueId(sensor: SensorEntity): string {
    return sensor['id'] + ':' + sensor['connect_sub_type'];
  }
}
