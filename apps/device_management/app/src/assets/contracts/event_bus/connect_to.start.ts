import {eventBusSchema} from '../../../types/event_bus';
import {SensorEntity} from '../../../types/sensors/sensor.entity';

export namespace ConnectToStartContract {
    export const routingKey = 'connect_to.start.query';
    export const exchange = eventBusSchema.connect_to.name;
    export const queue = 'connect_start';

    export class Request {
        sensor: SensorEntity;
    }

    export class Response {
    }
}
