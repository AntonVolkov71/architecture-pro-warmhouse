import { eventBusSchema } from '../../../types/event_bus';
import { Telemetry } from '../../../types/telemetry';

export namespace TelemetryEmitContract {
  export const routingKey = 'telemetry.query';
  export const exchange = eventBusSchema.connect_to_device.name;
  export const queue = 'telemetry.emit';

  export class Request {
    data: Telemetry;
  }

  export class Response {
  }
}
