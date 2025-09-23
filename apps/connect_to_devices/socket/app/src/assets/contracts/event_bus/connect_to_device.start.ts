import { DeviceDto, eventBusSchema } from '../../../types/event_bus';

export namespace ConnectToDeviceStartContract {
  export const routingKey = 'connect_to_device.start.query';
  export const exchange = eventBusSchema.connect_to_device.name;
  export const queue = 'startConnect';

  export class Request {
    device: DeviceDto;
  }

  export class Response {
  }
}
