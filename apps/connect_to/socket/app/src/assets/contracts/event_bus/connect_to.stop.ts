import { eventBusSchema } from '../../../types/event_bus';
import { SensorEntity } from '../../../types/sensors/sensor.interface';

export namespace ConnectToStopContract {
  export const routingKey = 'connect_to.stop.query';
  export const exchange = eventBusSchema.connect_to.name;
  export const queue = 'connect_stop';

  export class Request {
    sensor: SensorEntity;
  }

  export class Response {}
}
