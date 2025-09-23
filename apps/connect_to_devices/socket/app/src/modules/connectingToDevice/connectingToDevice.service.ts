import { Injectable, Logger, Type } from '@nestjs/common';
import { ConnectingToDeviceInterface } from './connectingToDevice.interface';
import { EventBusService } from '../eventBus/EventBus.service';
import { ConnectToDeviceSubTypesList, DeviceDto } from '../../types/event_bus';

type subTypesState = {
  [key in ConnectToDeviceSubTypesList]: Type<ConnectingToDeviceInterface>;
};

@Injectable()
export class ConnectingToDeviceService {
  private readonly logger: Logger = new Logger(ConnectingToDeviceService.name);
  private readonly subTypes: subTypesState;

  public readonly connectingToDeviceInterface: Map<
    string,
    ConnectingToDeviceInterface
  >;

  constructor(private readonly eventBusService: EventBusService) {
    this.subTypes = {} as subTypesState;
    this.connectingToDeviceInterface = new Map<
      string,
      ConnectingToDeviceInterface
    >();
  }

  public setSubTypes(
    connectToDeviceSubTypesList: ConnectToDeviceSubTypesList,
    connectingToDeviceInterface: Type<ConnectingToDeviceInterface>
  ): void {
    this.subTypes[connectToDeviceSubTypesList] = connectingToDeviceInterface;
  }

  public async connectionStart(device: DeviceDto) {
    try {
      const uniqueId = this.createUniqueId(device); // уникальный id для сохранения в стейт Map

      // если по этому устройству соединение присутствует, получаем его останавливаем и удаляем
      if (this.connectingToDeviceInterface.has(uniqueId)) {
        const connect = this.connectingToDeviceInterface.get(uniqueId);

        if (connect) {
          connect.connectionStop(device);
        }

        this.connectingToDeviceInterface.delete(uniqueId);
      }

      const SubType = this.subTypes[device['type_name']];
      const instanceSubType = new SubType(this.eventBusService);

      this.connectingToDeviceInterface.set(uniqueId, instanceSubType);

      instanceSubType.connectionStart(device);
    } catch (err) {
      if (err instanceof Error) this.logger.error(err.message);
    }
  }

  public async connectionStop(device: DeviceDto) {
    try {
      const connecting = this.getConnecting(device);

      if (connecting) connecting.connectionStop(device);

      this.clearConnecting(device);
    } catch (err) {
      if (err instanceof Error) this.logger.error(err.message);
    }
  }

  private getConnecting(
    device: DeviceDto
  ): ConnectingToDeviceInterface | undefined {
    const uniqueId = this.createUniqueId(device); // уникальный id для сохранения в стейт Map

    if (
      this.connectingToDeviceInterface &&
      this.connectingToDeviceInterface.has(uniqueId)
    ) {
      return this.connectingToDeviceInterface.get(uniqueId);
    }

    return undefined;
  }

  private clearConnecting(device: DeviceDto): void {
    const uniqueId = this.createUniqueId(device); // уникальный id для сохранения в стейт Map

    if (
      this.connectingToDeviceInterface &&
      this.connectingToDeviceInterface.has(uniqueId)
    ) {
      this.connectingToDeviceInterface.delete(uniqueId);
    }
  }

  private createUniqueId(device: DeviceDto): string {
    return device["ip"] + ':' + device["serial_number"];
  }
}
