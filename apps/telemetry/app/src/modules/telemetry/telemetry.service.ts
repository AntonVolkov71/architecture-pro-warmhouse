import { Telemetry } from '../../types/telemetry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelemetryService {
  public handleData(data: Telemetry) {
    try {
      console.info('Telemetry data: ', data);
    } catch (e) {
      if (e instanceof Error) {
        console.error('error text', e.message);
      } else {
        console.error('error text', e);
      }
    }
  }
}
