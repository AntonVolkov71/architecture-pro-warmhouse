import {SensorEntity} from '../../../types/sensors/sensor.interface';
import {eventBusSchema} from '../../../types/event_bus';

export namespace CommandSensorContract {
  export const routingKey = 'command.sensor.command';
  export const exchange = eventBusSchema.connect_to.name;
  export const queue = 'command_sensor';

  export class Request {
    command: string;
    sensor: SensorEntity;
  }

  export class Response {
  }
}
