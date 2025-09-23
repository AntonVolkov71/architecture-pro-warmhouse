import { ConnectToDeviceList, DeviceDto, eventBusSchema } from '../../../types/event_bus';

export namespace DeviceGetContract {
  export const routingKey = 'device.get.query';  export const exchange = eventBusSchema.connect_to_device.name;
  export const queue = 'startConnect';

  export class Request {
    type_name: ConnectToDeviceList.SOCKET;
  }

  export class Response {
    devices: DeviceDto[];
    error?: string;
  }
}
