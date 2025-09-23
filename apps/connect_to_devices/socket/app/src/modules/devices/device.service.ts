import { Injectable } from '@nestjs/common';
import { EventBusService } from '../eventBus/EventBus.service';
import { DeviceGetContract } from '../../assets/contracts/event_bus/device.get';

@Injectable()
export class DeviceService {
  constructor(private readonly eventBusService: EventBusService) {}

  async findAll(
    request: DeviceGetContract.Request
  ): Promise<DeviceGetContract.Response | undefined | null> {
    return await this.eventBusService.send<
      DeviceGetContract.Request,
      DeviceGetContract.Response
    >(DeviceGetContract.exchange, DeviceGetContract.routingKey, request);
  }
}
