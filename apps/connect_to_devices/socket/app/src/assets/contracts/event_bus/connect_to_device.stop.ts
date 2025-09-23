import { DeviceDto, eventBusSchema } from '../../../types/event_bus';

export namespace ConnectToDeviceStopContract {
  export const routingKey = 'connect_to_device.stop.query';
  export const exchange = eventBusSchema.connect_to_device.name;
  export const queue = 'stopConnect';

  export class Request {
    device: DeviceDto;
  }

  export class Response {
  }
}
