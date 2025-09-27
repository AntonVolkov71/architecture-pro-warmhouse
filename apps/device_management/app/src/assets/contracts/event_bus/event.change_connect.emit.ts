import {DeviceDto, eventBusSchema} from '../../../types/event_bus';

export namespace EventsChangeConnectEmitContract {
  export const routingKey = 'events.changing_connect.query';
  export const exchange = eventBusSchema.connect_to_device.name;
  export const queue = 'changingConnect';

  export class Request {
    device: DeviceDto;
  }

  export class Response {
  }
}
