import {Module} from '@nestjs/common';
import {TelemetryService} from './telemetry.service';
import {connectedEntitiesInModule} from '../../utils/connected';
import {TelemetryEntity} from '../../types/telemetry/telemetry.entity';
import {TelemetryRepository} from './telemetry.repository';

@Module({
  imports: [connectedEntitiesInModule(TelemetryEntity)],
  providers: [TelemetryService, TelemetryRepository],
  exports: [TelemetryService],
})
export class TelemetryModule {
}
