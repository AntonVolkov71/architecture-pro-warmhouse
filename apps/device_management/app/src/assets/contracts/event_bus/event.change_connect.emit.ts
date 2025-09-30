import {eventBusSchema} from '../../../types/event_bus';
import {SensorEntity} from '../../../types/sensors/sensor.entity';

export namespace EventsChangeConnectEmitContract {
  export const routingKey = 'events.changing_connect.query';
  export const exchange = eventBusSchema.connect_to.name;
  export const queue = 'changingConnect';

  export class Request {
    sensor: SensorEntity
  }

  export class Response {
  }
}
