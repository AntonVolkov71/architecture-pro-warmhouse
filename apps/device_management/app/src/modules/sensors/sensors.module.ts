import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { connectedEntitiesInModule } from '../../utils/connected';
import { SensorEntity } from '../../types/sensors/sensor.entity';
import { SensorRepository } from './sensors.repository';
import { EventBusModule } from '../eventBus/EventBus.module';

@Module({
  imports: [connectedEntitiesInModule(SensorEntity), EventBusModule],
  providers: [SensorsService, SensorRepository],
  controllers: [SensorsController],
  exports: [SensorsService],
})
export class SensorsModule {}
