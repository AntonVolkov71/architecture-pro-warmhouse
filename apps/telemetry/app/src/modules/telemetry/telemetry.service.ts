import { Injectable } from '@nestjs/common';
import { TelemetryEntity } from '../../types/telemetry/telemetry.entity';
import { Telemetry } from '../../types/telemetry/telemetry';
import { TelemetryRepository } from './telemetry.repository';

@Injectable()
export class TelemetryService {
  constructor(private readonly repository: TelemetryRepository) {}

  public async handleData(data: Telemetry) {
    try {
      console.info('telemetry data', data);

      const entity = new TelemetryEntity();
      entity.initialization(data);

      await this.repository.save(entity);
    } catch (e) {
      if (e instanceof Error) {
        console.error('error text', e.message);
      } else {
        console.error('error text', e);
      }
    }
  }
}
